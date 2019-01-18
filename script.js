function handleFile(e) {

    responseJSON(e);
    //Get the files from Upload control
    var files = e.target.files;
    var i, f;
    var trainerJSON;

    for (i = 0, f = files[i]; i != files.length; ++i) 
    {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function (e)
        {
            var data = e.target.result;
            var result;
            var datas = [];
            var workbook = XLSX.read(data, { type: 'binary' });
            var sheet_name_list = workbook.SheetNames;
            sheet_name_list.forEach(function (y)
             {
                var worksheet = workbook.Sheets[y];
                var headers = {};
                    for(data in worksheet) 
                    {
                        if(data[0] === '!') continue;
                        var col = data.substring(0,1);
                        var row = parseInt(data.substring(1));
                        var value = worksheet[data].v;
                        if(row == 1) 
                        {
                            if(col=="A") {headers[col] = "text";}
                            if(col=="B") {headers[col] = "intent";}
                            if(col=="C") {headers[col] = "entities";}
                            if(col=="D") {headers[col] = "response";}
                            continue;
                        }
                        else 
                        {
                            if(col=="A") 
                            {
                                var Question = value;
                                value = value.trim();
                                //console.log(Question+":Space\n")
                            }
                            if(col=="C") 
                            {
                                var obj = [] ;
                                var entitiesArray = value.split(',');
                                var myJSON =[];
                                var index=0;
                                for(var i = 0; i < entitiesArray.length; i++)
                                {
                                    entities = entitiesArray[i].trim();
                                    var startIndex = Question.trim().toLowerCase().indexOf(entities.toLowerCase());
                                    var endIndex = startIndex+(entities.length);
                                    if(startIndex>=0)
                                    { 
                                        obj[index] = { start: startIndex, end: endIndex, entity: entities};
                                        index++;
                                    }
                                }
                                value =  obj ;
                            }
                        }
                        if(col!="D")
                        {
                            if(!datas[row]) datas[row]={};
                            datas[row][headers[col]] = value;
                        }
                    }
             });
             datas.shift();
             datas.shift();
             
            var format=[];     format[0]= { common_examples: datas};
            var trainer=[];    trainer[0]= { rasa_nlu_data:  format[0]};

            
            trainerJSON = JSON.stringify(trainer);
            $('#myTextarea').val(trainerJSON);
        };
        reader.readAsArrayBuffer(f);
      
    }
    
}


  

//Change event to dropdownlist
$(document).ready(function () 
{
    $('#customFile').change(handleFile);
    $("#upload").on("click", function() 
    {
        alert('File Uploaded');
    });
    
});

