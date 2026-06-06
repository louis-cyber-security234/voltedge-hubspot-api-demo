# Private App and API Token Handling Plan

This document explains how API tokens and credentials should be handled for the VoltEdge RevOps demo.

## Core Rule

No real API tokens, private app keys, webhook secrets, OAuth secrets, Stripe keys, Slack webhooks or ad platform credentials should be committed to GitHub.

## Safe to Commit

The following are safe to commit:

- Placeholder variable names
- `.env.example`
- Documentation
- Mock payloads
- Test data with fake companies
- Workflow screenshots
- Non-sensitive workflow structure

## Not Safe to Commit

The following must never be committed:

- Real `.env` files
- HubSpot private app tokens
- n8n credential exports
- Slack webhook URLs
- Stripe live/test secret keys
- OAuth client secrets
- Access tokens
- Refresh tokens
- Real customer data

## HubSpot Private App Notes

A production implementation should use a HubSpot private app with only the scopes required for the workflow.

Possible scopes depend on the final build, but may include:

- CRM object read/write access for contacts
- CRM object read/write access for companies
- CRM object read/write access for deals
- Property read access
- Association read/write access where needed

Scopes should be reviewed before implementation and reduced to the minimum required.

## n8n Credential Handling

n8n credentials should be stored inside n8n’s credential manager.

They should not be exported into GitHub.

If workflow JSON is exported for portfolio evidence, credentials should be removed, redacted or replaced with placeholders.

## Environment Variable Pattern

Use `.env.example` to document required variables.

Use a real `.env` file only locally or inside a secure runtime environment.

The real `.env` file should be excluded by `.gitignore`.

## Rotation Plan

If a token is accidentally exposed:

1. Revoke the token immediately.
2. Generate a new token.
3. Update the credential inside n8n or the secure runtime.
4. Check GitHub history for leaked secrets.
5. Add or strengthen `.gitignore`.
6. Document the incident and fix.

## Demo Positioning

This repo demonstrates API integration awareness, but does not expose real credentials. The purpose is to show safe RevOps automation design, not live production access.
