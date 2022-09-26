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
  [Contributor name]
;

select
  lower([Recipient]) as Recipient,
  lower([Political Party of Recipient]) as 'Political Party of Recipient',
  lower([Contributor name]) as 'Contributor name',
  sum([Monetary amount]) as 'Monetary amount'
from
  od_cntrbtn_audt_e_1
where
  --   [Fiscal/Election date] >= '2021-12-31'
  [Political Party of Recipient] in ("People's Party of Canada","Libertarian Party of Canada")
  and [Contributor name] not like 'Contributions of%'
group by
  lower([Recipient]),
  lower([Political Party of Recipient]),
  lower([Contributor name])
order by
  [Contributor name];