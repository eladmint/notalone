// Script to fetch nested blocks recursively
const token = process.env.NOTION_TOKEN;

async function fetchBlockChildren(blockId, depth = 0) {
  const indent = "  ".repeat(depth);
  const response = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();

  for (const block of (data.results || [])) {
    console.log(`${indent}[${block.type}] ID: ${block.id}`);

    // Print detailed info for database-related blocks
    if (block.type === 'child_database' ||
        block.type === 'linked_database' ||
        block.type?.includes('database')) {
      console.log(`${indent}  FULL DATA:`);
      console.log(JSON.stringify(block, null, 2));
    }

    // Recurse into children
    if (block.has_children) {
      await fetchBlockChildren(block.id, depth + 1);
    }
  }
}

const templatePageId = "2c585dd502d580eeb974c1f3cd8afc57";
console.log("=== RECURSIVE BLOCK TREE ===\n");
fetchBlockChildren(templatePageId).catch(console.error);
