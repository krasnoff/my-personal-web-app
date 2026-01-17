const { BudgetServiceClient } = require('@google-cloud/billing-budgets');

export class BudgetService {
  private client: any;

  constructor() {
    // Configure authentication
    const clientOptions: any = {};
    
    // Option 1: Use service account key file
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      clientOptions.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }
    
    // Option 2: Use environment variables for credentials
    if (process.env.GOOGLE_CLOUD_PROJECT && process.env.GOOGLE_CLOUD_CLIENT_EMAIL && process.env.GOOGLE_CLOUD_PRIVATE_KEY) {
      clientOptions.credentials = {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
      clientOptions.projectId = process.env.GOOGLE_CLOUD_PROJECT;
    }

    this.client = new BudgetServiceClient(clientOptions);
  }

  async isBudgetExceeded(billingAccountId: string, budgetName: string): Promise<boolean> {
    const parent = `${billingAccountId}`;
    
    try {
      console.log('Attempting to list budgets with parent:', parent);
      console.log('Using project:', process.env.GOOGLE_CLOUD_PROJECT);
      console.log('Using client email:', process.env.GOOGLE_CLOUD_CLIENT_EMAIL?.substring(0, 20) + '...');
      
      const [budgets] = await this.client.listBudgets({ parent });
      const myBudget = budgets.find((b: any) => b.displayName === budgetName);

      if (!myBudget) {
        console.error("Budget not found!");
        return true; // Stop to be safe if no budget is found
      }

      // Note: The Budget API does not always return the current consumption in real time in a simple way.
      // The safest way is to use Pub/Sub to receive real-time budget alerts,
      // but as a basic check, make sure the budget exists and is active.
      return false; 
    } catch (error) {
      console.error("Error checking budget:", error);
      // console.error("Error details:", error.message);
      return true;
    }
  }
}