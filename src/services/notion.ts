/**
 * Notion Integration Service for AI-247 Assistant
 * 
 * Configured for standby mode:
 * - If process.env.NOTION_API_KEY is provided, it connects to Notion REST API endpoints.
 * - If not provided, it logs a clear status warning and returns structured standby responses.
 */

export interface NotionPagePayload {
  title: string;
  category?: string;
  status?: string;
  content?: string;
}

export async function createNotionPage(payload: NotionPagePayload) {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    console.info("[Notion Service] Standby Mode: NOTION_API_KEY or NOTION_DATABASE_ID is empty. Fill credentials in .env to activate real sync.");
    return {
      success: false,
      mode: "standby",
      message: "Notion integration is prepared in standby mode. Add NOTION_API_KEY and NOTION_DATABASE_ID to activate.",
      item: payload
    };
  }

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: payload.title
                }
              }
            ]
          },
          Status: {
            select: {
              name: payload.status || "To Do"
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Notion API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return {
      success: true,
      mode: "active",
      data
    };
  } catch (error: any) {
    console.error("[Notion Service Error]:", error);
    return {
      success: false,
      mode: "error",
      error: error.message || "Failed to create Notion page"
    };
  }
}
