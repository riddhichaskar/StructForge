from typing import List, Dict

class ParseReport:
    def __init__(self):
        self.valid = True
        self.fixes: list[str] = []
        self.warnings: list[str] = []

    def add_fix(self, message: str):
        self.valid = False
        self.fixes.append(message)

    def add_warning(self, message: str):
        self.warnings.append(message)

    # RENAMED from summary() to to_dict() to match parser.py
    def to_dict(self) -> dict:
        if self.valid:
            return {
                "valid": True,
                "message": "Directory structure is valid",
                "fixes": [],
                "warnings": self.warnings
            }

        return {
            "valid": False,
            "message": "We fixed issues in your directory structure",
            "fixes": self.fixes,
            "warnings": self.warnings
        }