// math.js
var opDropdown = [[Blockly.Msg.MATH_ADDITION_SYMBOL, 'ADD'],
                  [Blockly.Msg.MATH_SUBTRACTION_SYMBOL, 'MINUS'],
                  [Blockly.Msg.MATH_MULTIPLICATION_SYMBOL, 'MULTIPLY'],
                  [Blockly.Msg.MATH_DIVISION_SYMBOL, 'DIVIDE'],
                  ['%', 'MODULUS']];
Blockly.Blocks['math_arithmetic'] = {
  /**
   * Block for basic arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    this.appendValueInput("OPERAND0")
        .setCheck("Number")
        .appendField("", "PARENTHESIS_L");;
    this.appendValueInput("OPERAND1")
        .setCheck("Number")
        .appendField(new Blockly.FieldDropdown(opDropdown), "OP1");
    this.appendDummyInput('TRAIL_PARENTHESIS').appendField("", 'PARENTHESIS_R');
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(Blockly.Blocks.math.HUE);
    this.setHelpUrl(Blockly.Msg.MATH_ARITHMETIC_HELPURL);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP1');
      var TOOLTIPS = {
        'ADD': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD,
        'MINUS': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS,
        'MULTIPLY': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY,
        'DIVIDE': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE,
        'MODULUS': '% modulus'
      };
      return TOOLTIPS[mode];
    });

    this.opCount_ = 1;
    this.needParenthesis = false;
    this.setMutator(new Blockly.Mutator([['math_arithmetic_needParenthesis'], ['math_arithmetic_operator']]));
  },

  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.opCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.opCount_) {
      container.setAttribute('op', this.opCount_);
    }
    if (this.needParenthesis) {
      container.setAttribute('parenthesis', 'true');
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.opCount_ = parseInt(xmlElement.getAttribute('op'), 10) || 0;
    this.needParenthesis = xmlElement.getAttribute('parenthesis')=='true';
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('math_arithmetic_operator0');
    containerBlock.initSvg();
    if (this.needParenthesis) {
      var block = workspace.newBlock('math_arithmetic_needParenthesis');
      block.initSvg();
      containerBlock.getInput('PARENTHESIS').connection.connect(block.outputConnection);
    }
    var connection = containerBlock.nextConnection;
    for (var i = 2; i <= this.opCount_; i++) {
      var opBlock = workspace.newBlock('math_arithmetic_operator');
      opBlock.initSvg();
      connection.connect(opBlock.previousConnection);
      connection = opBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    if (containerBlock.getInput('PARENTHESIS').connection.targetConnection) this.needParenthesis = true;
    else                                                                    this.needParenthesis = false;
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    // Count number of inputs.
    this.opCount_ = 1;
    var operatorSelections = [null];
    var operandConnections = [null];
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'math_arithmetic_operator':
          this.opCount_++;
          operatorSelections[this.opCount_] = clauseBlock.operatorSelection_;
          operandConnections[this.opCount_] = clauseBlock.operandConnection_;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 2; i <= this.opCount_; i++) {
      this.setFieldValue(operatorSelections[i], 'OP'+i);
      Blockly.Mutator.reconnect(operandConnections[i], this, 'OPERAND' + i);
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    var i = 2;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'math_arithmetic_operator':
          var fieldOperator = this.getFieldValue('OP'+i);
          var inputOperand = this.getInput('OPERAND'+i)
          clauseBlock.operatorSelection_ = fieldOperator;
          clauseBlock.operandConnection_ =
              inputOperand && inputOperand.connection.targetConnection;
          i++;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    var i = 2;
    while (this.getInput('OPERAND' + i)) {
      this.removeInput('OPERAND' + i);
      i++;
    }
    this.removeInput('TRAIL_PARENTHESIS');
    this.initSvg();
    // Rebuild block.
    for (var i = 2; i <= this.opCount_; i++) {
      var field = new Blockly.FieldDropdown(opDropdown);
      this.appendValueInput('OPERAND' + i)
          .setCheck('Number')
          .appendField(field, 'OP'+i);
      this.initSvg();
    }
    this.appendDummyInput('TRAIL_PARENTHESIS').appendField("", 'PARENTHESIS_R');
    if (this.needParenthesis) {
      this.setFieldValue("(", 'PARENTHESIS_L');
      this.setFieldValue(")", 'PARENTHESIS_R');
    }
    else {
      this.setFieldValue("", 'PARENTHESIS_L');
      this.setFieldValue("", 'PARENTHESIS_R');
    }
  }
};

Blockly.Blocks['math_arithmetic_operator0'] = {
  init: function() {
    this.setColour(Blockly.Blocks.math.HUE);
    this.appendValueInput('PARENTHESIS')
        .setCheck('needParenthesis')
        .appendField('加減乘除');
    this.setPreviousStatement(false);
    this.setNextStatement(true);
    //this.setTooltip('懶得解釋...');
    this.contextMenu = false;
  }
};
Blockly.Blocks['math_arithmetic_operator'] = {
  init: function() {
    this.setColour(Blockly.Blocks.math.HUE);
    this.appendDummyInput()
        .appendField('加減乘除');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    //this.setTooltip('懶得解釋...');
    this.contextMenu = false;
  },
  operatorSelection_: 'ADD'
};
Blockly.Blocks['math_arithmetic_needParenthesis'] = {
  init: function() {
    this.setColour(Blockly.Blocks.math.HUE);
    this.appendDummyInput()
        .appendField('括號');
    this.setOutput(true, "needParenthesis");
  }
}


// logic.js
Blockly.Blocks['controls_if'] = {
  /**
   * Block for if/elseif/else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.appendValueInput('IF0')
        .setCheck('Boolean')
        .appendField("if (");
    this.appendDummyInput()
        .appendField(") {");
    this.appendStatementInput('DO0')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    this.appendDummyInput()
        .appendField("}");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['controls_if_elseif',
                                         'controls_if_else']));
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      if (!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
      } else if (!thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
      } else if (thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
      } else if (thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
      }
      return '';
    });
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
  },
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.elseifCount_) {
      container.setAttribute('elseif', this.elseifCount_);
    }
    if (this.elseCount_) {
      container.setAttribute('else', 1);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
    this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('controls_if_if');
    containerBlock.initSvg();
    var connection = containerBlock.nextConnection;
    for (var i = 1; i <= this.elseifCount_; i++) {
      var elseifBlock = workspace.newBlock('controls_if_elseif');
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      var elseBlock = workspace.newBlock('controls_if_else');
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    // Count number of inputs.
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
    var valueConnections = [null];
    var statementConnections = [null];
    var elseStatementConnection = null;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          this.elseifCount_++;
          valueConnections.push(clauseBlock.valueConnection_);
          statementConnections.push(clauseBlock.statementConnection_);
          break;
        case 'controls_if_else':
          this.elseCount_++;
          elseStatementConnection = clauseBlock.statementConnection_;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 1; i <= this.elseifCount_; i++) {
      Blockly.Mutator.reconnect(valueConnections[i], this, 'IF' + i);
      Blockly.Mutator.reconnect(statementConnections[i], this, 'DO' + i);
    }
    Blockly.Mutator.reconnect(elseStatementConnection, this, 'ELSE');
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    var i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          var inputIf = this.getInput('IF' + i);
          var inputDo = this.getInput('DO' + i);
          clauseBlock.valueConnection_ =
              inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        case 'controls_if_else':
          var inputDo = this.getInput('ELSE');
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('ELSE')) {
      this.removeInput('ELSEHEAD');
      this.removeInput('ELSE');
      this.removeInput('ELSETAIL');
    }
    var i = 1;
    while (this.getInput('IF' + i)) {
      this.removeInput('IF' + i);
      this.removeInput('IFTAIL' + i);
      this.removeInput('DO' + i);
      this.removeInput('DOTAIL' + i);
      i++;
    }
    // Rebuild block.
    for (var i = 1; i <= this.elseifCount_; i++) {
      this.appendValueInput('IF' + i)
          .setCheck('Boolean')
          .appendField("else if (");
      this.appendDummyInput('IFTAIL' + i)
          .appendField(") {");
      this.appendStatementInput('DO' + i)
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
      this.appendDummyInput('DOTAIL' + i)
          .appendField("}");
    }
    if (this.elseCount_) {
      this.appendDummyInput('ELSEHEAD')
          .appendField("else {");
      this.appendStatementInput('ELSE')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
      this.appendDummyInput('ELSETAIL')
          .appendField("}");
    }
  }
};

Blockly.Blocks['controls_if_if'] = {
  /**
   * Mutator block for if container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.logic.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CONTROLS_IF_IF_TITLE_IF);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_if_elseif'] = {
  /**
   * Mutator block for else-if condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.logic.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_if_else'] = {
  /**
   * Mutator block for else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.logic.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE);
    this.setPreviousStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_ifelse'] = {
  /**
   * If/else block that does not use a mutator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%{BKY_CONTROLS_IF_MSG_IF} %1",
      "args0": [
        {
          "type": "input_value",
          "name": "IF0",
          "check": "Boolean"
        }
      ],
      "message1": "%{BKY_CONTROLS_IF_MSG_THEN} %1",
      "args1": [
        {
          "type": "input_statement",
          "name": "DO0"
        }
      ],
      "message2": "%{BKY_CONTROLS_IF_MSG_ELSE} %1",
      "args2": [
        {
          "type": "input_statement",
          "name": "ELSE"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.logic.HUE,
      "tooltip": Blockly.Msg.CONTROLS_IF_TOOLTIP_2,
      "helpUrl": Blockly.Msg.CONTROLS_IF_HELPURL
    });
  }
};

Blockly.Blocks['logic_compare'] = {
  /**
   * Block for comparison operator.
   * @this Blockly.Block
   */
  init: function() {
    var rtlOperators = [
      ['==', 'EQ'],
      ['!=', 'NEQ'],
      ['\u200F<\u200F', 'LT'],
      ['\u200F<=\u200F', 'LTE'],
      ['\u200F>\u200F', 'GT'],
      ['\u200F>=\u200F', 'GTE']
    ];
    var ltrOperators = [
      ['==', 'EQ'],
      ['!=', 'NEQ'],
      ['<', 'LT'],
      ['<=', 'LTE'],
      ['>', 'GT'],
      ['>=', 'GTE']
    ];
    var OPERATORS = this.RTL ? rtlOperators : ltrOperators;
    this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('A')
        .setCheck("Number");
    this.appendValueInput('B')
        .setCheck("Number")
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'EQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ,
        'NEQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ,
        'LT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT,
        'LTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE,
        'GT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT,
        'GTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE
      };
      return TOOLTIPS[op];
    });
    this.prevBlocks_ = [null, null];
  },
  /**
   * Called whenever anything on the workspace changes.
   * Prevent mismatched types from being compared.
   * @param {!Blockly.Events.Abstract} e Change event.
   * @this Blockly.Block
   */
  onchange: function(e) {
    var blockA = this.getInputTargetBlock('A');
    var blockB = this.getInputTargetBlock('B');
    // Disconnect blocks that existed prior to this change if they don't match.
    if (blockA && blockB &&
        !blockA.outputConnection.checkType_(blockB.outputConnection)) {
      // Mismatch between two inputs.  Disconnect previous and bump it away.
      // Ensure that any disconnections are grouped with the causing event.
      Blockly.Events.setGroup(e.group);
      for (var i = 0; i < this.prevBlocks_.length; i++) {
        var block = this.prevBlocks_[i];
        if (block === blockA || block === blockB) {
          block.unplug();
          block.bumpNeighbours_();
        }
      }
      Blockly.Events.setGroup(false);
    }
    this.prevBlocks_[0] = blockA;
    this.prevBlocks_[1] = blockB;
  }
};


var LOGICOPERATORS =
     [[Blockly.Msg.LOGIC_OPERATION_AND, 'AND'],
     [Blockly.Msg.LOGIC_OPERATION_OR, 'OR']];
Blockly.Blocks['logic_operation'] = {
  /**
   * Block for logical operations: 'and', 'or'.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LOGIC_OPERATION_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true, 'Boolean');
    this.appendValueInput("OPERAND0")
        .setCheck("Boolean")
        .appendField("", "PARENTHESIS_L");;
    this.appendValueInput("OPERAND1")
        .setCheck("Boolean")
        .appendField(new Blockly.FieldDropdown(LOGICOPERATORS), "OP1");
    this.appendDummyInput('TRAIL_PARENTHESIS').appendField("", 'PARENTHESIS_R');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP1');
      var TOOLTIPS = {
        'AND': Blockly.Msg.LOGIC_OPERATION_TOOLTIP_AND,
        'OR': Blockly.Msg.LOGIC_OPERATION_TOOLTIP_OR
      };
      return TOOLTIPS[op];
    });
    this.opCount_ = 1;
    this.needParenthesis = false;
    this.setMutator(new Blockly.Mutator([['logic_operation_needParenthesis'], ['logic_operation_operator']]));
  },
    
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.opCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.opCount_) {
      container.setAttribute('op', this.opCount_);
    }
    if (this.needParenthesis) {
      container.setAttribute('parenthesis', 'true');
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.opCount_ = parseInt(xmlElement.getAttribute('op'), 10) || 0;
    this.needParenthesis = xmlElement.getAttribute('parenthesis')=='true';
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('logic_operation_operator0');
    containerBlock.initSvg();
    if (this.needParenthesis) {
      var block = workspace.newBlock('logic_operation_needParenthesis');
      block.initSvg();
      containerBlock.getInput('PARENTHESIS').connection.connect(block.outputConnection);
    }
    var connection = containerBlock.nextConnection;
    for (var i = 2; i <= this.opCount_; i++) {
      var opBlock = workspace.newBlock('logic_operation_operator');
      opBlock.initSvg();
      connection.connect(opBlock.previousConnection);
      connection = opBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    if (containerBlock.getInput('PARENTHESIS').connection.targetConnection) this.needParenthesis = true;
    else                                                                    this.needParenthesis = false;
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    // Count number of inputs.
    this.opCount_ = 1;
    var operatorSelections = [null];
    var operandConnections = [null];
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'logic_operation_operator':
          this.opCount_++;
          operatorSelections[this.opCount_] = clauseBlock.operatorSelection_;
          operandConnections[this.opCount_] = clauseBlock.operandConnection_;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 2; i <= this.opCount_; i++) {
      this.setFieldValue(operatorSelections[i], 'OP'+i);
      Blockly.Mutator.reconnect(operandConnections[i], this, 'OPERAND' + i);
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    var i = 2;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'logic_operation_operator':
          var fieldOperator = this.getFieldValue('OP'+i);
          var inputOperand = this.getInput('OPERAND'+i)
          clauseBlock.operatorSelection_ = fieldOperator;
          clauseBlock.operandConnection_ =
              inputOperand && inputOperand.connection.targetConnection;
          i++;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    var i = 2;
    while (this.getInput('OPERAND' + i)) {
      this.removeInput('OPERAND' + i);
      i++;
    }
    this.removeInput('TRAIL_PARENTHESIS');
    this.initSvg();
    // Rebuild block.
    for (var i = 2; i <= this.opCount_; i++) {
      var field = new Blockly.FieldDropdown(LOGICOPERATORS);
      this.appendValueInput('OPERAND' + i)
          .setCheck('Boolean')
          .appendField(field, 'OP'+i);
      this.initSvg();
    }
    this.appendDummyInput('TRAIL_PARENTHESIS').appendField("", 'PARENTHESIS_R');
    if (this.needParenthesis) {
      this.setFieldValue("(", 'PARENTHESIS_L');
      this.setFieldValue(")", 'PARENTHESIS_R');
    }
    else {
      this.setFieldValue("", 'PARENTHESIS_L');
      this.setFieldValue("", 'PARENTHESIS_R');
    }
  }

};

Blockly.Blocks['logic_operation_operator0'] = {
  init: function() {
    this.setColour(Blockly.Blocks.logic.HUE);
    this.appendValueInput('PARENTHESIS')
        .setCheck('needParenthesis')
        .appendField('AND/OR');
    this.setPreviousStatement(false);
    this.setNextStatement(true);
    //this.setTooltip('懶得解釋...');
    this.contextMenu = false;
  }
};
Blockly.Blocks['logic_operation_operator'] = {
  init: function() {
    this.setColour(Blockly.Blocks.logic.HUE);
    this.appendDummyInput()
        .appendField('AND/OR');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    //this.setTooltip('懶得解釋...');
    this.contextMenu = false;
  },
  operatorSelection_: 'AND'
};
Blockly.Blocks['logic_operation_needParenthesis'] = {
  init: function() {
    this.setColour(Blockly.Blocks.logic.HUE);
    this.appendDummyInput()
        .appendField('括號');
    this.setOutput(true, "needParenthesis");
  }
}


Blockly.Blocks['logic_negate'] = {
  /**
   * Block for negation.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.LOGIC_NEGATE_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "BOOL",
          "check": "Boolean"
        }
      ],
      "output": "Boolean",
      "inputsInline": true,
      "colour": Blockly.Blocks.logic.HUE,
      "tooltip": Blockly.Msg.LOGIC_NEGATE_TOOLTIP,
      "helpUrl": Blockly.Msg.LOGIC_NEGATE_HELPURL
    });
  }
};


//Blockly.Blocks['math_change'] = undefined;