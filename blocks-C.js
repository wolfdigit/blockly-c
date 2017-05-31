var COLOR = {MAIN:215, COUT:230, CIN:190};
Blockly.Blocks.math.HUE = 100;
Blockly.Blocks.variables.HUE = 70;
Blockly.Blocks.logic.HUE = 30;
Blockly.Blocks.loops.HUE = 0;

Blockly.Blocks['main'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("#include <iostream>");
    this.appendDummyInput()
        .appendField("using namespace std;");
    this.appendDummyInput();
    this.appendDummyInput()
        .appendField("int main() {");
    this.appendDummyInput()
        .appendField(indent+"int n;", "VARDEC");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.appendDummyInput()
        .appendField(indent+"return 0;");
    this.appendDummyInput()
        .appendField("}");
    this.setInputsInline(false);
    this.setColour(COLOR.MAIN);
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
    this.setColour(COLOR.COUT);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['outstream_text'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("outstream")
        .appendField(" << \"")
        .appendField(new Blockly.FieldTextInput("asdf"), "NAME")
        .appendField("\"");
    this.setInputsInline(false);
    this.setOutput(true, "outstream");
    this.setColour(COLOR.COUT);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['outstream_var'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("outstream")
        .appendField(" << ")
        .appendField(new Blockly.FieldVariable("item"), "NAME");
    this.setInputsInline(false);
    this.setOutput(true, "outstream");
    this.setColour(COLOR.COUT);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['outstream_endl'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(" << ")
        .appendField("endl");
    this.setInputsInline(true);
    this.setOutput(true, "outstream");
    this.setColour(COLOR.COUT);
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
    this.setColour(COLOR.CIN);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['instream_var'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("instream")
        .appendField(" >> ")
        .appendField(new Blockly.FieldVariable("item"), "NAME");
    this.setInputsInline(false);
    this.setOutput(true, "instream");
    this.setColour(COLOR.CIN);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};




Blockly.Blocks['loop_for'] = {
  init: function() {
    this.appendValueInput("VAL1")
        .setCheck("Number")
        .appendField("for (")
        .appendField(new Blockly.FieldVariable("i"), "VAR1")
        .appendField("=");
    this.appendValueInput("VAL2")
        .setCheck("Number")
        .appendField("; ")
        .appendField(new Blockly.FieldVariable("i"), "VAR2")
        .appendField(new Blockly.FieldDropdown([["<","LT"], ["<=","LE"], [">","GT"], [">=","GE"]]), "CMP");
    this.appendValueInput("VAL3")
        .setCheck("Number")
        .appendField("; ")
        .appendField(new Blockly.FieldVariable("i"), "VAR3")
        .appendField("+=");
    this.appendDummyInput()
        .appendField(") {");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("}");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setColour(Blockly.Blocks.loops.HUE);
    this.setTooltip('');
    this.setHelpUrl('');
    this.onchange = function(changeEvent) {
      if (typeof changeEvent.name!=="undefined" && changeEvent.name.startsWith("VAR")) {
        if (typeof changeEvent.newValue!=="undefined") {
          this.inputList[0].fieldRow[1].setValue(changeEvent.newValue);
          this.inputList[1].fieldRow[1].setValue(changeEvent.newValue);
          this.inputList[2].fieldRow[1].setValue(changeEvent.newValue);
          //console.log(this);
          //console.log(changeEvent);          
        }
      }
    };
  }
};

Blockly.Blocks['loop_break'] = {
  init: function() {
    this.jsonInit({
      "message0": "break;",
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.loops.HUE,
      "tooltip": "跳離最內圈的迴圈",
    });
  }
};

Blockly.Blocks['loop_continue'] = {
  init: function() {
    this.jsonInit({
      "message0": "continue;",
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.loops.HUE,
      "tooltip": "略過剩下的行數直接開始下一次迴圈",
    });
  }
};