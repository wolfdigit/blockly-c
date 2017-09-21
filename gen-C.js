var indent = '    ';

function gen_c(block) {
    var retv = [];

    var prevType = 0;
    for (var i in block.inputList) {
        var input = block.inputList[i];

        var inputLine = "";
        for (var j in input.fieldRow) {
            inputLine += input.fieldRow[j].text_;
        }
        
        if (input.type==5) {          // dummy input
            if (prevType==5 || prevType==3) inputLine = '\n' + inputLine;
        }
        else if (input.type==3) {     // statement input
            if (input.connection.targetConnection!=null) {
                var childLine = gen_c(input.connection.targetConnection.sourceBlock_);
                childLine = indent + childLine.split('\n').join('\n'+indent);
                inputLine = '\n' + inputLine + childLine;
            }
        }
        else if (input.type==1) {     // value input
            if (input.connection.targetConnection!=null) {
                var childLine = gen_c(input.connection.targetConnection.sourceBlock_);
                
                inputLine = inputLine + childLine;
                if (prevType==5 || prevType==3) inputLine = '\n' + inputLine;
            }
        }
        else {
            inputLine += "T"+input.type;
            console.log(input);
        }
        
        prevType = input.type;
        
        retv.push(inputLine);
    }

    retv = retv.join('');



    if (block.nextConnection!=null && block.nextConnection.targetConnection!=null) {
        if (block.nextConnection.targetConnection.sourceBlock_.id != block.id) {
        retv += '\n' + gen_c(block.nextConnection.targetConnection.sourceBlock_);
        }
    }

    return retv;
}

function genVarLine() {
      // var declare line
      var varLine;
      if (Blockly.Variables.allUsedVariables(workspace).length>0) {
          varLine = "int " + Blockly.Variables.allUsedVariables(workspace).join(', ') + ";";
      }
      else {
          varLine = "";
      }

      return indent+varLine;
}