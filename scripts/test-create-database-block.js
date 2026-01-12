// Script to test creating a child_database block via blocks.children.append
// This will help confirm API limitations

const token = process.env.NOTION_TOKEN;

// Use a test page ID - we'll create a simple test
const testPageId = "2c585dd502d580eeb974c1f3cd8afc57"; // The template page

async function testCreateChildDatabase() {
  console.log("=== TEST 1: Try to create child_database block via blocks.children.append ===\n");

  const response = await fetch(`https://api.notion.com/v1/blocks/${testPageId}/children`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      children: [
        {
          type: "child_database",
          child_database: {
            title: "Test Database from API"
          }
        }
      ]
    })
  });

  const data = await response.json();
  console.log("Response status:", response.status);
  console.log(JSON.stringify(data, null, 2));
}

async function testCreateDatabaseEndpoint() {
  console.log("\n=== TEST 2: Try to create database via databases endpoint ===\n");

  const response = await fetch(`https://api.notion.com/v1/databases`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      parent: {
        type: "page_id",
        page_id: testPageId
      },
      title: [
        {
          type: "text",
          text: {
            content: "Test Database via API"
          }
        }
      ],
      properties: {
        Name: {
          title: {}
        }
      }
    })
  });

  const data = await response.json();
  console.log("Response status:", response.status);
  console.log(JSON.stringify(data, null, 2));
}

async function testListAllDatabases() {
  console.log("\n=== TEST 3: List all databases accessible to integration ===\n");

  const response = await fetch(`https://api.notion.com/v1/search`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      filter: {
        property: "object",
        value: "database"
      },
      page_size: 10
    })
  });

  const data = await response.json();
  console.log("Response status:", response.status);
  console.log("Total databases found:", data.results?.length || 0);

  for (const db of (data.results || [])) {
    console.log(`\n  Database: ${db.title?.[0]?.plain_text || "Untitled"}`);
    console.log(`  ID: ${db.id}`);
    console.log(`  Parent type: ${db.parent?.type}`);
    console.log(`  Is inline: ${db.is_inline}`);
  }
}

async function main() {
  await testCreateChildDatabase();
  await testCreateDatabaseEndpoint();
  await testListAllDatabases();
}

main().catch(console.error);
