/**
 * NotionManager Sync Configuration
 * Project: NOTALONE-IL
 * Created: 2025-12-10
 */

import 'dotenv/config';

export const config = {
  notion: {
    token: process.env.NOTION_TOKEN,
    pages: [
      {
        pageId: '2c960b6e8d1881f98e48c4f6acbc1f4f',
        filePath: './docs/NOTALONE-IL.md',
        title: 'NOTALONE IL',
        conflictStrategy: 'interactive',
      },
      {
        pageId: '2d960b6e8d1881c2b139e9a8d37d70b9',
        filePath: './docs/DEAL_FLOW_SYSTEM_SETUP.md',
        title: 'NOTALONE Deal Flow System',
        conflictStrategy: 'interactive',
      },
    ],
    databases: [
      {
        databaseId: '9c6652d9860d48fa9f8caed4300141f7',
        name: 'Deal Flow Pipeline',
        purpose: 'Main deals tracker with 8 stages from sourcing to exit',
      },
      {
        databaseId: 'cba20df169e34bc5ba617ae7565677bd',
        name: 'Screening Memos',
        purpose: 'Initial screening assessments linked to deals',
      },
      {
        databaseId: 'f5f39f36a4d348cfbb5f24ce6f86c089',
        name: 'Due Diligence Tracker',
        purpose: 'Investment and growth fit due diligence',
      },
      {
        databaseId: 'b88ab7850341474faacaa2038df216c7',
        name: 'Investment Committee Decisions',
        purpose: 'IC decisions with scoring framework',
      },
      {
        databaseId: 'd28728e1f4fa4cf8a701dcd4ce3b90cf',
        name: 'Growth Assets Activations',
        purpose: 'Conference activations and growth support tracking',
      },
    ],
  },
  git: {
    repoPath: '.',
    autoCommit: true,
    commitMessage: 'docs: Update from Notion sync',
  },
  fileUpload: {
    enabled: false, // Set true if you need file/image upload support
    backend: 'github', // Options: 'github', 's3', 'imgur'
  },
  sync: {
    pollInterval: 60000, // 60 seconds
    autoSync: true,
  },
};

export default config;
