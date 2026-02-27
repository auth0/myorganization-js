/**
 * Node.js TypeScript CLI Example for MyOrganization SDK
 *
 * This example demonstrates standalone scripts and CLI tools for organization management
 */

import dotenv from "dotenv";
import { Command } from "commander";
import chalk from "chalk";
import { createMyOrganizationClientWithClientCredentials } from "@auth0/myorganization-js/server";
import { MyOrganization, MyOrganizationError } from "@auth0/myorganization-js";

dotenv.config();

const program = new Command();

// Initialize client
function getClient() {
    const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_PRIVATE_KEY, AUTH0_ORGANIZATION } = process.env;

    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_ORGANIZATION) {
        console.error(chalk.red("Missing required environment variables"));
        process.exit(1);
    }

    if (AUTH0_PRIVATE_KEY) {
        return createMyOrganizationClientWithClientCredentials(
            { domain: AUTH0_DOMAIN },
            {
                clientId: AUTH0_CLIENT_ID,
                privateKey: AUTH0_PRIVATE_KEY.replace(/\\n/g, "\n"),
                organization: AUTH0_ORGANIZATION,
            },
        );
    }

    if (AUTH0_CLIENT_SECRET) {
        return createMyOrganizationClientWithClientCredentials(
            { domain: AUTH0_DOMAIN },
            {
                clientId: AUTH0_CLIENT_ID,
                clientSecret: AUTH0_CLIENT_SECRET,
                organization: AUTH0_ORGANIZATION,
            },
        );
    }

    throw new Error("Either AUTH0_CLIENT_SECRET or AUTH0_PRIVATE_KEY required");
}

// Error handler
function handleError(error: unknown) {
    if (error instanceof MyOrganization.BadRequestError) {
        console.error(chalk.red("Bad request:"), error.message);
    } else if (error instanceof MyOrganization.UnauthorizedError) {
        console.error(chalk.red("Unauthorized: check your credentials"));
    } else if (error instanceof MyOrganization.ForbiddenError) {
        console.error(chalk.red("Forbidden: insufficient permissions"));
    } else if (error instanceof MyOrganization.NotFoundError) {
        console.error(chalk.red("Not found:"), error.message);
    } else if (error instanceof MyOrganization.TooManyRequestsError) {
        console.error(chalk.red("Rate limit exceeded"));
    } else if (error instanceof MyOrganizationError) {
        console.error(chalk.red(`API error [${error.statusCode}]:`), error.message);
    } else {
        console.error(chalk.red("Error:"), error);
    }
    process.exit(1);
}

// Commands
program.name("myorg-cli").description("CLI for Auth0 MyOrganization Management").version("1.0.0");

program
    .command("org:details")
    .description("Get organization details")
    .action(async () => {
        try {
            const client = getClient();
            const details = await client.organizationDetails.get();
            console.log(chalk.green("Organization details:"));
            console.log(JSON.stringify(details, null, 2));
        } catch (error) {
            handleError(error);
            return;
        }
    });

program
    .command("domains:list")
    .description("List all domains")
    .action(async () => {
        try {
            const client = getClient();
            const result = await client.organization.domains.list();
            console.log(chalk.green(`Domains (${result.organization_domains?.length || 0}):`));
            console.log(JSON.stringify(result, null, 2));
        } catch (error) {
            handleError(error);
            return;
        }
    });

program
    .command("domains:create <domain>")
    .description("Create a new domain")
    .action(async (domain: string) => {
        try {
            const client = getClient();
            console.log(chalk.blue(`📋 Creating domain ${domain}...\n`));
            const result = await client.organization.domains.create({ domain });
            console.log(chalk.green("Domain created:"));
            console.log(JSON.stringify(result, null, 2));
        } catch (error) {
            handleError(error);
            return;
        }
    });

program
    .command("idp:list")
    .description("List all identity providers")
    .action(async () => {
        try {
            const client = getClient();
            const result = await client.organization.identityProviders.list();
            console.log(chalk.green(`Identity providers (${result.identity_providers?.length || 0}):`));
            console.log(JSON.stringify(result, null, 2));
        } catch (error) {
            handleError(error);
            return;
        }
    });

program
    .command("idp:create-oidc")
    .description("Create OIDC identity provider")
    .requiredOption("--name <name>", "Provider name")
    .requiredOption("--display-name <displayName>", "Display name")
    .requiredOption("--client-id <clientId>", "OIDC client ID")
    .requiredOption("--client-secret <clientSecret>", "OIDC client secret")
    .requiredOption(
        "--discovery-url <discoveryUrl>",
        "OIDC discovery URL (e.g. https://idp.company.com/.well-known/openid-configuration)",
    )
    .action(async (options) => {
        try {
            const client = getClient();

            const result = await client.organization.identityProviders.create({
                strategy: "oidc",
                name: options.name,
                display_name: options.displayName,
                show_as_button: true,
                assign_membership_on_login: true,
                is_enabled: true,
                options: {
                    type: "back_channel",
                    client_id: options.clientId,
                    client_secret: options.clientSecret,
                    discovery_url: options.discoveryUrl,
                },
            });

            console.log(chalk.green("Identity provider created:"));
            console.log(JSON.stringify(result, null, 2));
        } catch (error) {
            handleError(error);
            return;
        }
    });

program.parse();
