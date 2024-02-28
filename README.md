# Openalex TypeScript SDK

This is a TypeScript SDK for interacting with the Openalex API.

## Description

This SDK provides a set of TypeScript interfaces and functions to interact with the Openalex API, making it easier to fetch and manipulate journal information data.

# Open Alex SDK Installation Guide

This guide provides detailed instructions on how to install and set up the Open Alex SDK (openalex-sdk), a JavaScript library designed for easy interaction with the Open Alex API.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js (v18 or later)** - Required to run JavaScript code outside a web browser.
2. **Git** - Used to clone the SDK's source code.

## Step 1: Install Node.js

Node.js is essential for running the SDK. Follow these instructions based on your operating system.

### Windows and macOS

- Visit the [Node.js download page](https://nodejs.org/en/download/) and download the installer for Node.js 18.x for your operating system.
- Run the installer and follow the prompts to install Node.js and npm.

### Linux

Install Node.js v18 using the command line:

```bash
# For Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# For CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# For Fedora
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs
```

## Step 2: Install Git

Git is necessary for cloning the SDK repository. Installation steps vary based on your OS.

### Windows

- Download the installer from [Git for Windows](https://git-scm.com/download/win) and follow the installation instructions.

### macOS

- Verify if Git is installed by running `git --version` in the Terminal.
- If not installed, download it from [Git for macOS](https://git-scm.com/download/mac) or install via Homebrew with `brew install git`.

### Linux

Use your distribution's package manager to install Git:

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install git

# CentOS/RHEL
sudo yum install git

# Fedora
sudo dnf install git
```

## Step 3: Clone the Open Alex SDK Repository

With Git installed, you can now clone the Open Alex SDK repository to your local machine. Open a terminal or command prompt and execute the following command:

```bash
git clone https://github.com/OpenDevEd/OpenAlex-SDK.git
```

## Step 4: Install SDK Dependencies

After cloning the repository, navigate to the directory of the Open Alex SDK using your terminal or command prompt. Run the following command to install all necessary dependencies that are defined in the `package.json` file:

```bash
cd path/to/openalex-sdk
npm install
```

This step ensures that all the required Node.js packages are installed in your local development environment, setting you up for successful development with the Open Alex SDK.

## Configuration

### Setting API Key and Email (Optional)

The Open Alex API does not strictly require authentication for public data access, but providing an email or API key can help with request attribution and may be necessary for accessing certain endpoints or increased rate limits in the future. If you have an API key or wish to identify your requests with an email, you can configure these as follows:

```ts
import { OpenAlex } from 'openalex-sdk';

const openAlexSDK = new OpenAlexSDK({
  email: 'your-email@example.com', // Optional
  apiKey: 'your-api-key' // Optional
});
```

## Methods

The OpenAlex SDK provides various methods to interact with the OpenAlex API, enabling you to retrieve and manipulate data related to academic works, authors, venues, institutions, and concepts. Below is a summary of the primary methods available:

### work(id, externalIds)

Retrieves a specific work by its ID or external identifier.

- `id`: The unique identifier of the work.
- `externalIds`: Optional parameter for external identifiers.

### works(searchParameters)

Retrieves a list of works based on the provided search parameters.

- `searchParameters`: An object containing parameters used to search for works, such as search query, field to search in, number of works per page, page number, and more.

### autoCpmleteWorks(search)

Retrieves a list of works that match the provided search query, intended for autocomplete functionalities.

- `search`: The search query string.

### ngram(id)

Retrieves a list of ngrams for a specific work by its ID.

- `id`: The unique identifier of the work.

### author(id, externalIds)

Retrieves a specific author by their ID or external identifier.

- `id`: The unique identifier of the author.
- `externalIds`: Optional parameter for external identifiers.

These methods facilitate the retrieval of detailed information from the OpenAlex database, providing access to a rich dataset of academic information. Utilizing these methods within your application allows for the integration of comprehensive academic data, leveraging the OpenAlex API's extensive capabilities.

Then, you can use the SDK to interact with the Openalex API:

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
