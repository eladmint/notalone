// Script to fetch and analyze blocks from template page
const templatePageId = "2c585dd502d580eeb974c1f3cd8afc57";
const token = process.env.NOTION_TOKEN;

async function fetchBlocks() {
  const response = await fetch(`https://api.notion.com/v1/blocks/${templatePageId}/children?page_size=100`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();

  console.log("=== ALL BLOCKS IN TEMPLATE PAGE ===\n");
  console.log("Total blocks:", data.results?.length || 0);
  console.log("\n");

  for (let i = 0; i < (data.results?.length || 0); i++) {
    const block = data.results[i];
    console.log(`--- Block ${i + 1} ---`);
    console.log("ID:", block.id);
    console.log("Type:", block.type);
    console.log("Has children:", block.has_children);

    // Print the full block data for database-related blocks
    if (block.type === 'child_database' || block.type === 'linked_database') {
      console.log("\nFULL BLOCK DATA:");
      console.log(JSON.stringify(block, null, 2));
    }
    console.log("\n");
  }

  // Also return raw JSON for detailed analysis
  console.log("\n=== RAW JSON FOR DATABASE BLOCKS ===\n");
  const dbBlocks = data.results?.filter(b =>
    b.type === 'child_database' ||
    b.type === 'linked_database' ||
    b.type?.includes('database')
  );

  if (dbBlocks?.length > 0) {
    console.log(JSON.stringify(dbBlocks, null, 2));
  } else {
    console.log("No database blocks found with expected types.");
    console.log("\nAll block types found:");
    const types = [...new Set(data.results?.map(b => b.type))];
    console.log(types);

    console.log("\n=== FULL RAW DATA ===\n");
    console.log(JSON.stringify(data, null, 2));
  }
}

fetchBlocks().catch(console.error);
