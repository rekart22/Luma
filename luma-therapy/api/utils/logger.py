import sys
from loguru import logger

# Remove default logger
logger.remove()

# Add colored logging to stdout
logger.add(
    sys.stdout,
    colorize=True,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="DEBUG"
)

# Add file logging for errors
logger.add(
    "logs/error.log",
    rotation="500 MB",
    retention="10 days",
    level="ERROR",
    backtrace=True,
    diagnose=True
)

# Configure logger levels with custom colors
logger.level("INFO", color="<green>")
logger.level("SUCCESS", color="<green>")
logger.level("WARNING", color="<yellow>")
logger.level("ERROR", color="<red>")
logger.level("CRITICAL", color="<red><bold>")

# Export logger instance
__all__ = ["logger"] 