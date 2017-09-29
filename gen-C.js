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

function genVarLines() {
    var isArr = {};
    for (var k in workspace.blockDB_) {
        var block = workspace.blockDB_[k];
        if (block.type=='arraySet') {
            isArr[block.getField("ARRAYNAME").value_] = true;
        }
        if (block.type=='arrayGet') {
            isArr[block.getField("ARRAYNAME").value_] = true;
        }
    }

    var allVar = Blockly.Variables.allUsedVariables(workspace);
    var simpleVar = [];
    var arrVar = [];
    for (var k in allVar) {
        if (isArr[allVar[k]]) arrVar.push(allVar[k]);
        else                  simpleVar.push(allVar[k]);
    }

    // var declare line
    var varLines = [indent, []];
    if (simpleVar.length>0) {
        //varLine = "int " + Blockly.Variables.allUsedVariables(workspace).join(', ') + ";";
        varLines[0] = indent+"int " + simpleVar.join(', ') + ";";
    }
    else {
        varLines[0] = indent+"";
    }
    varLines[1] = arrVar;
    if (arrVar.length>0) {
        //varLines[1] = indent + "int "+arrVar.map(function(x){return x+"[10]"}).join(', ')+";";
        //workspace.blockDB_["H%U;spC#]?*Q+L=|Q^a:"].getInput("MAIN").appendField(new Blockly.FieldTextInput("XD"), "TEXT1")
    }

    return varLines;
}

function setBlockARRDECInput(input, vars) {
  if (typeof arrSizes==="undefined") arrSizes=[];
  //var arrSizes = [];
  /*
  for (var i=0; ; i++) {
    var field = input.getField("ARR"+i);
    if (field==null) break;
    arrSizes[i] = field.text_;
  }
  */
  while (input.fieldRow.length>0) {
    input.removeField(input.fieldRow[0].name);
  }
  
  if (vars.length>0) {
    //input.appendField(indent+"int ", "int");
    for (var i=0; i<vars.length; i++) {
      if (i==0) pre=indent+"int "+vars[i]+"[";
      else      pre=vars[i]+"[";
      if (i==vars.length-1) post="];";
      else                  post="], ";
      
      input.appendField(pre, "pre"+i);
      input.appendField(new Blockly.FieldNumber(arrSizes["ARR"+i]?arrSizes["ARR"+i]:10, 2), "ARR"+i);
      input.appendField(post, "post"+i);
      
      //if (i<vars.length-1) input.appendField(", ", "comma"+i);
    }
    //input.appendField(";", "semicolon")
  }
  else {
    input.appendField(indent, "indentEmpty");
  }
}