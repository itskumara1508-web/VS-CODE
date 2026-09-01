"""Unit tests for the NTRO AI Service lexicon analyzer."""
import os
import sys

import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.analyzer import analyze_text  # noqa: E402


class TestAnalyzer(unittest.TestCase):

    def test_negative_text_is_negative(self):
        result = analyze_text("This is a terrible, horrible, awful situation. I hate it.")
        self.assertEqual(result["sentiment"], "negative")
        self.assertLess(result["sentimentScore"], 0)
        self.assertEqual(result["stance"], "against")

    def test_positive_text_is_positive(self):
        result = analyze_text("This is a great, amazing, wonderful day. I love it!")
        self.assertEqual(result["sentiment"], "positive")
        self.assertGreater(result["sentimentScore"], 0)
        self.assertEqual(result["stance"], "support")

    def test_empty_text_is_neutral(self):
        result = analyze_text("")
        self.assertEqual(result["sentiment"], "neutral")
        self.assertEqual(result["sentimentScore"], 0.0)
        self.assertEqual(result["emotions"]["neutral"], 1.0)

    def test_whitespace_text_is_neutral(self):
        result = analyze_text("   ")
        self.assertEqual(result["sentiment"], "neutral")

    def test_hindi_negative_text(self):
        result = analyze_text("Yeh bahut kharab hai, mujhe dar lag raha hai.")
        self.assertIn(result["sentiment"], ("negative", "neutral"))

    def test_result_shape(self):
        result = analyze_text("Support this new policy, it is good for everyone.")
        self.assertIn("sentiment", result)
        self.assertIn("emotions", result)
        self.assertIn("stance", result)
        self.assertIn("confidence", result)
        self.assertEqual(
            set(result["emotions"].keys()),
            {
                "joy", "anger", "fear", "sadness", "surprise",
                "excitement", "anxiety", "supportive", "hostile", "neutral",
            }
        )
        # Emotions should sum to (approximately) 1
        self.assertLess(abs(sum(result["emotions"].values()) - 1.0), 0.02)

    def test_confidence_bounds(self):
        result = analyze_text("Great product, very good quality, I support it.")
        conf = result["confidence"]
        self.assertTrue(0.5 <= conf["score"] <= 0.95)
        self.assertTrue(conf["low"] <= conf["score"] <= conf["high"])


if __name__ == "__main__":
    unittest.main()
