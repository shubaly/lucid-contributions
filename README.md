# Lucid Contributions

## Notes

* https://www.elections.ca/content.aspx?section=fin&dir=oda&document=index&lang=e
* head -10 od_cntrbtn_audt_e.csv > data.csv
  * add head line and shuffle rest
  * or: grep "Dartmouth--Cole Harbour" od_cntrbtn_audt_e.csv | grep "2018-12-31" > data.csv

* npm start --example=src

* TODO https://stackoverflow.com/questions/28800151/randomly-selecting-rows-with-header-intact

select
  lower([Recipient]) as Recipient,
  lower([Political Party of Recipient]) as 'Political Party of Recipient',
  lower([Contributor name]) as 'Contributor name',
  sum([Monetary amount]) as 'Monetary amount'
from
  od_cntrbtn_audt_e_1
where
  [Fiscal/Election date] >= '2016-12-31'
  and [Electoral District] in (
    'Dartmouth--Cole Harbour',
    'Halifax',
    'Halifax West',
    'South Shore--St. Margarets',
    'Central Nova',
    'Sydney--Victoria',
    'Kings--Hants',
    'Cape Breton--Canso',
    'Sackville--Preston--Chezzetcook',
    'West Nova'
  )
  and [Contributor name] not like 'Contributions of%'
group by
  lower([Recipient]),
  lower([Political Party of Recipient]),
  lower([Contributor name])
order by
  [Contributor name];

### Run
* npm install
* npm start --example=src
* 
### Enhancements
* Make this work with any jurisdiction's data without code changes!
* Make nodes draggable so researchers can reposition
* Size nodes based on contribution value (+ sum for recipients)
* Add ability to search for contributor / recipient 