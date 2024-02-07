# Openalex TypeScript SDK

This is a TypeScript SDK for interacting with the Openalex API.

## Description

This SDK provides a set of TypeScript interfaces and functions to interact with the Openalex API, making it easier to fetch and manipulate journal information data.

## Installation

To install the SDK, use npm:

### future

```bash
npm install openalex-sdk
```

### forNow

```bash
npm i 
```

## Usage

First, import the SDK in your TypeScript file:

```ts
import { OpenAlex } from 'openalex-sdk';
```

Then, you can use the SDK to interact with the Openalex API:

```ts
 const res = await openAlex.works({
    search: 'education',
    searchField: 'title',
    perPage: 200,
    startPage: 2,
    endPage: 3,
    fileName: 'education',
    retriveAllPages: false,
  });
  console.log(res);
```

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
