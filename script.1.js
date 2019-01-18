function responseJSON(e) {
    

    //Get the files from Upload control
    var files = e.target.files;
    var i, f;
    
    for (i = 0, f = files[i]; i != files.length; ++i) 
    {
        var reader = new FileReader();
        reader.onload = function (e)
        {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });
            var sheet_name_list = workbook.SheetNames;
 
            sheet_name_list.forEach(function (y)
             {
                var worksheet = workbook.Sheets[y];
                var response= new Array();
                var dataSet = new Array();

                    for(data in worksheet) 
                    {
                        if(data[0] === '!') continue;
                        var col = data.substring(0,1);
                        var row = parseInt(data.substring(1));
                        var value = worksheet[data].v;
      
                        if(row != 1)
                        {
                              var question;
                              var intent;
                              var response;
  
                              if(col=="A") 
                              {
                                  question = value;
                              }
                              if(col=="B") 
                              {
                                  intent = value.toLowerCase();
                              }
                              if(col=="C") 
                              {
                                var entitiesList = value.toLowerCase().replace(/\s/g, "_").replace(/,/g, "_").replace(/__/g, "_");
                                entitiesList = entitiesList.split('_').sort().join('_');
                              }
                              if(col=="D") 
                              {
                                  trainResponse = value;
  
                                 var responseTrainer = [];                                 
                                 responseTrainer.push({[entitiesList] : trainResponse});

                                 if(!dataSet[intent])
                                 {
                                      dataSet[intent]={};
                                 }
                                        
                                 dataSet.push({[intent]: responseTrainer});

                              }
                            }
                        }
                    response.push({response: dataSet});
                    $('#myTextarea1').val(JSON.stringify(response));
                    
             });
        };
        reader.readAsArrayBuffer(f);
    }
      
  };
  
  
    
  
  
  