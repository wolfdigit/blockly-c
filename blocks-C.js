var COLOR = {MAIN:215, COUT:230, CIN:190};
Blockly.Blocks.math.HUE = 100;
Blockly.Blocks.variables.HUE = 70;
Blockly.Blocks.logic.HUE = 30;
Blockly.Blocks.loops.HUE = 0;
var indent = '    ';

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
        .appendField(indent+"", "VARDEC");
    this.appendDummyInput("ARRDEC")
        .appendField(indent+"", "ARRDEC");
    this.appendStatementInput("MAIN")
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
    this.appendValueInput("OUTSTREAM")
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
    this.appendValueInput("OUTSTREAM")
        .setCheck("outstream")
        .appendField(" << \"")
        .appendField(new Blockly.FieldTextInput("asdf"), "TEXT")
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
    this.appendValueInput("OUTSTREAM")
        .setCheck("outstream")
        .appendField(" << ")
        .appendField(new Blockly.FieldVariable("item"), "VAR");
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
    this.appendValueInput("INSTREAM")
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
    this.appendValueInput("INSTREAM")
        .setCheck("instream")
        .appendField(" >> ")
        .appendField(new Blockly.FieldVariable("item"), "VAR");
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
      if (typeof changeEvent.name!=="undefined" && changeEvent.name.match(/^VAR\d$/)) {
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

Blockly.Blocks['comment'] = {
  init: function() {
    this.jsonInit({
      "message0": "// %1",
      "args0": [
          {
            "type": "field_input",
            "text": "這是註解"
          }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": COLOR.MAIN
    });
  }
};

Blockly.Blocks['commentBlk'] = {
  init: function() {
    this.jsonInit({
      "message0": "/* %1 %2 */",
      "args0": [
        {
          "type": "input_dummy"
        },
        {
          "type": "input_statement",
          "name": "commented-out-statments"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": COLOR.MAIN,
      "tooltip": "",
      "helpUrl": ""
    });
  }
};

Blockly.Blocks['blankLine'] = {
  init: function() {
    this.jsonInit({
      "message0": "",
      "previousStatement": null,
      "nextStatement": null,
      "colour": COLOR.MAIN
    });
  }
};

Blockly.Blocks['arraySet'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 [ %2 ] = %3 ;",
      "args0": [
        {
          "type": "field_variable",
          "name": "ARRAYNAME",
          "variable": "item"
        },
        {
          "type": "input_value",
          "name": "INDEX",
          "check": "Number"
        },
        {
          "type": "input_value",
          "name": "RHS",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.variables.HUE,
      "tooltip": "",
      "helpUrl": ""
    });
  }
};

Blockly.Blocks['arrayGet'] = {
  init: function() {
    this.jsonInit({
      "type": "block_type",
      "message0": "%1 [ %2 ]",
      "args0": [
        {
          "type": "field_variable",
          "name": "ARRAYNAME",
          "variable": "item"
        },
        {
          "type": "input_value",
          "name": "INDEX",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "output": "Number",
      "colour": Blockly.Blocks.variables.HUE,
      "tooltip": "",
      "helpUrl": ""
    });
  }
};
