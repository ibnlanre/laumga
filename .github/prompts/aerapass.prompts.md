---
applyTo: '**'
---

# @aerapass/country-data

Data about countries - like their ISO codes and currencies - with typings.

## installation

```bash
npm install @aerapass/country-data
```

## usage

```ts
import { countries, continents, currencies, regions } from '@aerapass/country-data'

// .all gives you an array of all entries
console.log(countries.all)
console.log(currencies.all)

// countries are found using alpha2 or alpha3 (both uppercase)
console.log(countries.BE.name) // 'Belgium'
console.log(countries.FRA.currencies) // \['EUR'\]

// currencies are accessed by their code (uppercase)
console.log(currencies.USD.name) // 'United States dollar'

// regions are accessed using a camel case name
console.log(regions.europe.countries)
```

## countries

The data currently provided for each country is:

-   `name` The english name for the country
-   `alpha2` The [ISO 3166-1 alpha 2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code
-   `alpha3` The [ISO 3166-1 alpha 3](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) code
-   `status`: The ISO status of the entry - see below.
-   `currencies` An array of [ISO 4217 currency codes](http://en.wikipedia.org/wiki/ISO_4217) with the primary one first
-   `languages` An array of [ISO 639-2](http://en.wikipedia.org/wiki/ISO_639-2) codes for languages (may not be complete).
-   `countryCallingCodes` An array of the international call prefixes for this country.
-   `ioc` The [International Olympic Committee country code](http://en.wikipedia.org/wiki/List_of_IOC_country_codes)
-   `emoji` The emoji of country's flag.
-   `numeric` The [ISO 3166-1 numeric](https://en.wikipedia.org/wiki/ISO_3166-1_numeric) code

### status-notes

The `status` can be one of 'assigned', 'reserved', 'user assigned' or 'deleted'.

Assigned means that the code is properly in the ISO 3166 standard. Reserved means that the code is being prevented from being used. Deleted means that it has been deleted. User Assigned means that for some use cases it is required. Deleted means that it used to be in the standard but is now not.

See [https://en.wikipedia.org/wiki/ISO\_3166-1\_alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) for full details, especially the "User-assigned code elements" and "Reserved code elements" sections.

## regions

Countries are ofter grouped into regions. The list of regions is by no means exhaustive, pull requests very welcome for additions.

-   `countries` An array of `alpha2` codes for the countries in this region.

## currencies

It is not that useful to just have the currency code(s) for a country, so included is currency data too:

-   `name` The english name for the currency
-   `code` The [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) code
-   `number` The [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) number
-   `decimals` The number of decimal digits conventionally shown
-   `symbol` The currency symbol for the currency (e.g. ¥, $ etc.). Some symbols are not available, in which case `symbol` contains the ISO 4217 code. Credit to [bengourley/currency-symbol-map](https://github.com/bengourley/currency-symbol-map) for the symbol database.

## sources

The currency data was copied from the [Wikipedia ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) page.

The country calling codes came from the [Wikipedia country calling codes](http://en.wikipedia.org/wiki/List_of_country_calling_codes) page.