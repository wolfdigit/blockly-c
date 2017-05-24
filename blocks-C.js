Blockly.Blocks['main'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("#include <iostream>");
    this.appendDummyInput()
        .appendField("using namespace std;");
    this.appendDummyInput();
    this.appendDummyInput()
        .appendField("int n;");
    this.appendDummyInput()
        .appendField("int main() {");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("}");
    this.setInputsInline(false);
    this.setColour(230);
    this.setTooltip('tip');
    this.setHelpUrl('help');
  }
};
Blockly.BlockSvg.START_HAT = true;

Blockly.Blocks['cout'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("outstream")
        .appendField("cout");
    this.appendDummyInput()
        .appendField(";");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['outstream_text'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("outstream")
        .appendField("<< \"")
        .appendField(new Blockly.FieldTextInput("asdf"), "NAME")
        .appendField("\"");
    this.setInputsInline(false);
    this.setOutput(true, "outstream");
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['outstream_var'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("outstream")
        .appendField("<<")
        .appendField(new Blockly.FieldVariable("item"), "NAME");
    this.setInputsInline(false);
    this.setOutput(true, "outstream");
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['cin'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("instream")
        .appendField("cin");
    this.appendDummyInput()
        .appendField(";");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['instream_var'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("instream")
        .appendField(">>")
        .appendField(new Blockly.FieldVariable("item"), "NAME");
    this.setInputsInline(false);
    this.setOutput(true, "instream");
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['outstream_endl'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("<< ")
        .appendField("endl");
    this.setInputsInline(false);
    this.setOutput(true, "outstream");
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};



Blockly.Blocks['loop_for'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("Number")
        .appendField("for (")
        .appendField(new Blockly.FieldVariable("item"), "NAME")
        .appendField("=");
    this.appendValueInput("NAME")
        .setCheck("Number")
        .appendField("; ")
        .appendField(new Blockly.FieldVariable("item"), "NAME2")
        .appendField(new Blockly.FieldDropdown([["<","OPTIONNAME"], ["<=","OPTIONNAME"], [">","OPTIONNAME"], [">=","OPTIONNAME"]]), "NAME4");
    this.appendValueInput("NAME")
        .setCheck("Number")
        .appendField("; ")
        .appendField(new Blockly.FieldVariable("item"), "NAME3")
        .appendField("+=");
    this.appendDummyInput()
        .appendField(") {");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("}");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
    this.onchange = function(changeEvent) {
      if (typeof changeEvent.name!=="undefined" && typeof changeEvent.newValue!=="undefined") {
        this.inputList[0].fieldRow[1].setValue(changeEvent.newValue);
        this.inputList[1].fieldRow[1].setValue(changeEvent.newValue);
        this.inputList[2].fieldRow[1].setValue(changeEvent.newValue);
        //console.log(this);
        //console.log(changeEvent);          
      }
    };
  }
};
