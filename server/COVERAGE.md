yarn run v1.22.22
$ jest --coverage
------------------------------|---------|----------|---------|---------|--------------------------------------
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                    
------------------------------|---------|----------|---------|---------|--------------------------------------
All files                     |   66.53 |    47.52 |   62.06 |    65.6 |                                      
 src                          |      64 |       50 |   33.33 |      64 |                                      
  app.ts                      |   66.66 |     62.5 |      50 |   66.66 | 18-25,29,42,47                       
  datasource.ts               |     100 |      100 |     100 |     100 |                                      
  router.ts                   |     100 |      100 |     100 |     100 |                                      
  swagger.ts                  |    37.5 |        0 |       0 |    37.5 | 126,130-144                          
 src/controllers              |      51 |    30.61 |   44.44 |      51 |                                      
  Addresses.ts                |      22 |        0 |       0 |      22 | 20,81-106,133-138,193-228            
  Users.ts                    |      80 |    71.42 |      80 |      80 | 84,94-95,124,170,176,185-188,213-214 
 src/entities                 |     100 |    66.66 |     100 |     100 |                                      
  Address.ts                  |     100 |     62.5 |     100 |     100 | 29-32                                
  User.ts                     |     100 |       75 |     100 |     100 | 26                                   
 src/tests/controllers        |     100 |      100 |     100 |     100 |                                      
  WordFinder.ts               |     100 |      100 |     100 |     100 |                                      
 src/utils                    |   68.85 |    58.33 |      75 |   68.33 |                                      
  getCoordinatesFromSearch.ts |   18.18 |        0 |       0 |   18.18 | 6-24                                 
  getCountriesStartingWith.ts |   85.71 |      100 |     100 |   83.33 | 8                                    
  getDistance.ts              |     100 |      100 |     100 |     100 |                                      
  getUserFromRequest.ts       |   68.96 |    66.66 |     100 |   68.96 | 12-21,30,43-47                       
  isAuthorized.ts             |     100 |      100 |     100 |     100 |                                      
 src/utils/resources          |     100 |      100 |     100 |     100 |                                      
  corpuses.ts                 |     100 |      100 |     100 |     100 |                                      
------------------------------|---------|----------|---------|---------|--------------------------------------
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
