# OpenAlex TypeScript SDK

## Description

This SDK provides a set of TypeScript interfaces and functions to interact with the OpenAlex API, making it easier to fetch and manipulate journal information data.

## Installation

This guide provides detailed instructions on how to install and set up the Open Alex SDK (openalex-sdk), a TypeScript library designed for easy interaction with the Open Alex API.

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
cd OpenAlex-SDK
npm install
```

This step ensures that all the required Node.js packages are installed in your local development environment, setting you up for successful development with the Open Alex SDK.

## Configuration

### Setting API Key and Email (Optional)

The Open Alex API does not strictly require authentication for public data access, but providing an email or API key can help with request attribution and may be necessary for accessing certain endpoints or increased rate limits in the future. If you have an API key or wish to identify your requests with an email, you can configure these as follows:

```ts
import OpenAlex from 'openalex-sdk';

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

### types

#### SearchParameters

`SearchParameters` is an object that contains parameters used to search for works. It has the following properties:

- `search`: The search query. This is the term that you want to search for.
- `searchField`: The field to search in. This can be the `abstract` or `title` or `title_and_abstract` or `display_name` or `fulltext`.
- `perPage`: The number of works to return per page.
- `page`: The page number to return.
- `startPage`: The starting page number for the search.
- `endPage`: The ending page number for the search.
- `retrieveAllPages`: A boolean indicating whether to retrieve all pages.
- `filter`: An object containing filter parameters to apply to the search.
- `groupBy`: A parameter to group the search results by a specific field.
- `sortBy`: A parameter to sort the search results by a specific field.
  - `field`: The field to sort by. This can be `display_name`, `cited_by_count`, `works_count`, `publication_date`, or `relevance_score`. Note that `relevance_score` only exists if there's a search filter active.
- `order`: The order of the sort. This can be `asc` for ascending order or `desc` for descending order.

- `toCsv`: A string indicating the path to save the results in CSV format.
- `toJson`: A string indicating the path to save the results in JSON format.

Here's an example of how to use `SearchParameters`:

```typescript

import OpenAlex from 'openalex-sdk';

const openAlexSDK = new OpenAlexSDK({
  email: 'your-email@example.com', // Optional
  apiKey: 'your-api-key' // Optional
});

const works = await openAlexSDK.works({
  search: 'search-term',
  searchField: 'title',
  perPage: 10,
  page: 1,
  retrieveAllPages: false,
  toCsv: 'path/to/save.csv',
  toJson: 'path/to/save.json',
  startPage: 1,
  endPage: 10,
  filter: { /* filter parameters */ },
  groupBy: 'field-to-group-by',
  sortBy: {
    field: 'cited_by_count',
    order: 'asc' // or 'desc'
  }
  });
```

### GroupBy

`GroupBy` is a type that represents the field to group the works by. It can be one of the following:

- `authors_count`
- `authorships.author.id`
- `authorships.author.orcid`
- `authorships.countries`
- `authorships.institutions.country_code`
- `authorships.institutions.continent`
- `authorships.institutions.is_global_south`
- `authorships.institutions.id`
- `authorships.institutions.lineage`
- `authorships.institutions.ror`
- `authorships.institutions.type`
- `authorships.is_corresponding`
- `apc_list.value`
- `apc_list.currency`
- `apc_list.provenance`
- `apc_list.value_usd`
- `apc_paid.value`
- `apc_paid.currency`
- `apc_paid.provenance`
- `apc_paid.value_usd`
- `best_oa_location.is_accepted`
- `best_oa_location.license`
- `best_oa_location.is_published`
- `best_oa_location.source.host_organization`
- `best_oa_location.source.id`
- `best_oa_location.source.is_in_doaj`
- `best_oa_location.source.issn`
- `best_oa_location.source.type`
- `best_oa_location.version`
- `best_open_version`
- `biblio.first_page`
- `biblio.issue`
- `biblio.last_page`
- `biblio.volume`
- `cited_by_count`
- `cites`
- `concepts_count`
- `concepts.id`
- `concepts.wikidata`
- `corresponding_author_ids`
- `corresponding_institutions_ids`
- `countries_distinct_count`
- `fulltext_origin`
- `grants.award_id`
- `grants.funder`
- `has_abstract`
- `has_doi`
- `has_fulltext`
- `has_orcid`
- `has_pmid`
- `has_pmcid`
- `has_ngrams`
- `has_references`
- `indexed_in`
- `is_retracted`
- `is_paratext`
- `journal`
- `keywords.keyword`
- `language`
- `locations.is_accepted`
- `locations.is_published`
- `locations.source.host_institution_lineage`
- `locations.source.is_in_doaj`
- `locations.source.publisher_lineage`
- `locations_count`
- `open_access.any_repository_has_fulltext`
- `open_access.is_oa`
- `open_access.oa_status`
- `primary_location.is_accepted`
- `primary_location.is_oa`
- `primary_location.is_published`
- `primary_location.license`
- `primary_location.source.has_issn`
- `primary_location.source.host_organization`
- `primary_location.source.id`
- `primary_location.source.is_in_doaj`
- `primary_location.source.issn`
- `primary_location.source.publisher_lineage`
- `primary_location.source.type`
- `primary_location.version`
- `publication_year`
- `repository`
- `sustainable_development_goals.id`
- `type`
- `type_crossref`

#### FilterParameters

`FilterParameters` is an object that contains parameters used to filter the works. It has the following properties:

- `authorships`: Filters works by authorship details. It is of type `Authorships`.
- `apc_list`: Filters works by APC payment details. It is of type `Apc_payment`.
- `apc_paid`: Filters works by whether APC was paid. It is of type `Apc_payment`.
- `LocationOpenAlexFilter`: Filters works by location details. It is of type `LocationOpenAlexFilter`.
- `cited_by_count`: Filters works by the count of citations. It is a number.
- `concepts`: Filters works by concept details. It is of type `Concept`.
- `corresponding_author_ids`: Filters works by corresponding author IDs. It is a string.
- `corresponding_institution_ids`: Filters works by corresponding institution IDs. It is a string.
- `countries_distinct_count`: Filters works by distinct count of countries. It is a number.
- `doi`: Filters works by DOI. It is a string.
- `fulltext_origin`: Filters works by the origin of fulltext. It is a string.
- `grants`: Filters works by grant details. It is of type `Grants`.
- `has_fulltext`: Filters works by whether it has fulltext. It is a boolean.
- `ids`: Filters works by IDs. It is of type `Ids`.
- `institutions_distinct_count`: Filters works by distinct count of institutions. It is a number.
- `is_paratext`: Filters works by whether it is a paratext. It is a boolean.
- `is_retracted`: Filters works by whether it is retracted. It is a boolean.
- `keywords`: Filters works by keywords. It is of type `Keywords`.
- `language`: Filters works by language. It is a string.
- `locations`: Filters works by location details. It is of type `LocationOpenAlexFilter`.
- `locations_count`: Filters works by count of locations. It is a number.
- `open_access`: Filters works by open access details. It is of type `Open_access`.
- `primary_location`: Filters works by primary location details. It is of type `LocationOpenAlexFilter`.
- `publication_year`: Filters works by publication year. It is a number.
- `publicatuon_date`: Filters works by publication date. It is a string.
- `sustainable_development_goals`: Filters works by sustainable development goals. It is of type `Sustainable_development_goals`.
- `type`: Filters works by type. It is of type `KeyTypeOpenAlex`.
- `TypeCrossRef`: Filters works by CrossRef type. It is of type `TypeCrossRef`.
- `abstract`: Filters works by abstract. It is of type `Abstract`.
- `authors_count`: Filters works by count of authors. It is a number.
- `best_open_version`: Filters works by the best open version. It can be 'any', 'published', or 'acceptedOrPublished'.
- `cited_by`: Filters works by who cited it. It is a string.
- `cites`: Filters works by who it cites. It is a string.
- `concepts_count`: Filters works by count of concepts. It is a number.
- `from_created_date`: Filters works by the date it was created. It is a string representing a date in the format "yyyy-mm-dd".
- `from_publication_date`: Filters works by the date it was published. It is a string representing a date in the format "yyyy-mm-dd".
- `from_updated_date`: Filters works by the date it was updated. It is a string representing a date in the format "yyyy-mm-dd".
- `has_abstract`: Filters works by whether it has an abstract. It is a boolean.
- `has_doi`: Filters works by whether it has a DOI. It is a boolean.
- `has_oa_accepted_or_published_version`: Filters works by whether it has an open access accepted or published version. It is a boolean.
- `has_oa_submitted_version`: Filters works by whether it has an open access submitted version. It is a boolean.
- `has_orcid`: Filters works by whether it has an ORCID. It is a boolean.
- `has_pmcid`: Filters works by whether it has a PMCID. It is a boolean.
- `has_pmid`: Filters works by whether it has a PMID. It is a boolean.
- `has_ngrams`: Filters works by whether it has ngrams. It is a boolean.
- `has_references`: Filters works by whether it has references. It is a boolean.
- `journal`: Filters works by journal. It is a string.
- `raw_affiliation_string`: Filters works by raw affiliation string. It is of type `Raw_affiliation_string`.
- `related_to`: Filters works by what it is related to. It is a string.
- `repository`: Filters works by repository. It is a string.
- `to_publication_date`: Filters works by the end date of publication. It is a string representing a date in the format "yyyy-mm-dd".
- `version`: Filters works by version. It can be 'publishedVersion', 'acceptedVersion', 'submittedVersion', or 'null'.

### Subcategories of Filter Parameters

#### Authorships

`Authorships` is an object that contains authorship details. It has the following properties:

- `author`: This is an `Author` object that contains details about an individual author.
- `countries`: This is an array of strings, each representing a country associated with the author.
- `institutions`: This is an `Institution` object that contains details about an institution associated with the author.
- `is_corresponding`: This is a boolean that indicates whether the author is the corresponding author for the document.

#### Author

`Author` is an object that contains author details. It has the following properties:

- `id`: This is a string that represents the unique identifier for the author.
- `orcid`: This is a string that represents the ORCID (Open Researcher and Contributor ID) of the author.

#### Institution

`Institution` is an object that contains institution details. It has the following properties:

- `id`: This is a string that represents the unique identifier for the institution.
- `country_code`: This is a string that represents the country code of the institution.
- `lineage`: This is an array of strings that represents the lineage (history) of the institution.
- `ror`: This is a string that represents the ROR (Research Organization Registry) ID of the institution.
- `continent`: This is a string that represents the continent where the institution is located.
- `type`: This is a string that represents the type of the institution.
- `is_global_south`: This is a boolean that indicates whether the institution is in the Global South.

#### LocationOpenAlexFilter

`LocationOpenAlexFilter` is an object that contains location details. It has the following properties:

- `is_accepted`: This is a boolean that indicates whether the document is accepted.
- `is_published`: This is a boolean that indicates whether the document is published.
- `license`: This is a string that represents the license of the document.
- `is_oa`: This is a boolean that indicates whether the document is open access (OA).
- `version`: This is a string that represents the version of the document.
- `source`: This is a `Source` object that contains details about the source of the document.

#### Source

`Source` is an object that contains source details. It has the following properties:

- `id`: This is a string that represents the unique identifier for the source.
- `issn`: This is an array of strings, each representing an ISSN (International Standard Serial Number) of the source.
- `is_in_doaj`: This is a boolean that indicates whether the source is in the DOAJ (Directory of Open Access Journals).
- `type`: This is a string that represents the type of the source.
- `host_organization`: This is a string that represents the host organization of the source.
- `host_institution_lineage`: This is a string that represents the lineage (history) of the host institution of the source.
- `publisher_lineage`: This is a string that represents the lineage (history) of the publisher of the source.
- `has_issn`: This is a boolean that indicates whether the source has an ISSN.

#### Concept

`Concept` is an object that contains concept details. It has the following properties:

- `id`: This is a string that represents the unique identifier for the concept.
- `wikidata`: This is a string that represents the Wikidata ID of the concept.

#### Grants

`Grants` is an object that contains grant details. It has the following properties:

- `funder`: This is a string that represents the funder of the grant.
- `award_id`: This is a string that represents the award ID of the grant.

#### Ids

`Ids` is an object that contains ID details. It has the following properties:

- `pmcid`: This is a string that represents the PMC (PubMed Central) ID of the document.
- `pmid`: This is a string that represents the PMID (PubMed ID) of the document.
- `openalex`: This is a string that represents the OpenAlex ID of the document.
- `mag`: This is a string that represents the MAG (Microsoft Academic Graph) ID of the document.

#### Keywords

`Keywords` is an object that contains keyword details. It has the following properties:

- `id`: This is a string that represents the unique identifier for the keyword.
- `name`: This is a string that represents the name of the keyword.
- `wikidata`: This is a string that represents the Wikidata ID of the keyword.

#### Open_access

`Open_access` is an object that contains details about the open access status of a document. It has the following properties:

- `any_repository_has_fulltext`: This is a boolean that indicates whether any repository has the full text of the document.
- `is_oa`: This is a boolean that indicates whether the document is open access (OA).
- `oa_status`: This is a string that represents the open access status of the document. It can be 'gold', 'green', 'bronze', 'hybrid', or 'closed'.

#### Sustainable_development_goals

`Sustainable_development_goals` is an object that contains details about the sustainable development goals associated with the document. It has the following properties:

- `id`: This is a string that represents the unique identifier for the sustainable development goal.

#### Abstract

`Abstract` is an object that contains details about the abstract of the document. It has the following properties:

- `search`: This is a string that represents the search query for the abstract.

#### Raw_affiliation_string

`Raw_affiliation_string` is an object that contains details about the raw affiliation string of the document. It has the following properties:

- `search`: This is a string that represents the search query for the raw affiliation string.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
