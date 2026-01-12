// Script to analyze the database blocks in detail
const token = process.env.NOTION_TOKEN;

// The two child_database block IDs found in the template
const dbBlockIds = [
  "2c585dd5-02d5-815f-8a73-f92a2ec9ae44", // First one (Interactions)
  "2c585dd5-02d5-8165-bfa6-fa3159ec6067"  // Second one (Todo List)
];

async function analyzeDatabase(blockId) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Analyzing block: ${blockId}`);
  console.log("=".repeat(60));

  // 1. Get the block details
  console.log("\n--- BLOCK DETAILS ---");
  const blockResponse = await fetch(`https://api.notion.com/v1/blocks/${blockId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    }
  });
  const blockData = await blockResponse.json();
  console.log(JSON.stringify(blockData, null, 2));

  // 2. Try to get it as a database
  console.log("\n--- DATABASE DETAILS (using databases/retrieve) ---");
  const dbResponse = await fetch(`https://api.notion.com/v1/databases/${blockId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    }
  });
  const dbData = await dbResponse.json();
  console.log(JSON.stringify(dbData, null, 2));

  // 3. If it's a linked database, look for the source database reference
  if (dbData.object === 'database') {
    console.log("\n--- KEY DATABASE PROPERTIES ---");
    console.log("ID:", dbData.id);
    console.log("Title:", dbData.title?.[0]?.plain_text || "No title");
    console.log("Is inline:", dbData.is_inline);
    console.log("Parent type:", dbData.parent?.type);
    console.log("Parent ID:", dbData.parent?.page_id || dbData.parent?.block_id);
    console.log("URL:", dbData.url);

    // Check if there's a source database (for linked views)
    if (dbData.parent?.database_id) {
      console.log("SOURCE DATABASE ID:", dbData.parent.database_id);
    }

    // List properties to understand the schema
    console.log("\n--- DATABASE PROPERTIES (schema) ---");
    for (const [key, value] of Object.entries(dbData.properties || {})) {
      console.log(`  ${key}: ${value.type}`);
    }
  }
}

async function main() {
  for (const id of dbBlockIds) {
    await analyzeDatabase(id);
  }
}

main().catch(console.error);
