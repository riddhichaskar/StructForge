from dataclasses import dataclass, field
from typing import List, Optional, Literal
from pathlib import Path
from datetime import datetime

@dataclass
class Node:
    name: str
    is_dir: bool
    depth: int
    content: Optional[str] = None

@dataclass
class BuildAction:
    type: Literal["dir", "file"]
    path: Path
    content: Optional[str] = None

@dataclass
class Manifest:
    destination: Path
    created: List[Path] = field(default_factory=list)
    timestamp: datetime = field(default_factory=datetime.utcnow)
