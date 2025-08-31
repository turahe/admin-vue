# Integration Settings

This module provides a comprehensive interface for managing third-party service integrations in the admin panel.

## Features

- **WhatsApp Business API**: Configure WhatsApp Business messaging and webhook settings
- **Google Services**: Set up Google OAuth for authentication and API access
- **Twitter/X API**: Manage Twitter API credentials for social media operations
- **Facebook Pages**: Configure Facebook app settings for business page management
- **GitHub Integration**: Set up GitHub OAuth for repository access and workflows

## Components

### Integration.vue

The main integration settings page that displays all available integrations in a card-based layout.

## API Integration

The component integrates with the following API endpoints:

- `GET /api/integrations/configs` - Retrieve all integration configurations
- `POST /api/integrations/configs` - Save all integration configurations
- `POST /api/integrations/reset` - Reset all configurations to defaults
- `PATCH /api/integrations/{service}/toggle` - Enable/disable specific services
- `GET /api/integrations/status` - Get status of all integration services
- `POST /api/integrations/test` - Test specific integration configurations

## Configuration Fields

### WhatsApp Business API

- Phone Number
- API Key
- Webhook URL

### Google Services

- Client ID
- Client Secret
- Redirect URI

### Twitter/X API

- API Key
- API Secret
- Access Token
- Access Token Secret

### Facebook Pages

- App ID
- App Secret
- Page ID

### GitHub Integration

- Client ID
- Client Secret
- Organization

## Usage

1. Navigate to `/settings/integration` in the admin panel
2. Toggle the switch for each integration service you want to enable
3. Fill in the required configuration fields for enabled services
4. Click "Save All Configurations" to persist your settings
5. Use "Reset to Defaults" to clear all configurations

## Security Features

- Password fields are masked with show/hide functionality
- Sensitive data is transmitted securely via HTTPS
- API keys and secrets are stored encrypted
- Integration status is tracked and logged

## Internationalization

The component supports both English and Indonesian languages with full translation coverage for all UI elements and messages.

## Responsive Design

The interface is fully responsive and works on desktop, tablet, and mobile devices with appropriate layout adjustments.

## Error Handling

- Comprehensive error messages for API failures
- User-friendly confirmation dialogs for destructive actions
- Graceful fallbacks when services are unavailable
- Detailed logging for debugging purposes
