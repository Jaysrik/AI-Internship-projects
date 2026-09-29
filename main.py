from mcp.server.fastmcp import FastMCP

# Create MCP server
mcp = FastMCP("Demo Server")

# 1. Define a simple tool
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers together"""
    return a + b

# 2. Define a simple resource
@mcp.resource("greeting://message")
def get_greeting() -> str:
    """Returns a simple greeting message"""
    return "Hello! This is data read from MCP Resource."

# 3. Define a simple prompt
@mcp.prompt()
def review_code(code: str) -> str:
    """Creates a prompt to review python code"""
    return f"Please review the following Python code for bugs and improvements:\n\n{code}"

if __name__ == "__main__":
    mcp.run(transport='stdio')