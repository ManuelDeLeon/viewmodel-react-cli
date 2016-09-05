var createViewModel = function(userArgs) {
  var fs = require('fs');
  //var userArgs = process.argv.slice(2);
  if (userArgs.length !== 1 || !/^[A-Z]/.test(userArgs[0])) {
    console.error("viewmodel cli accepts one parameter: the name of the new component (starting with a capital letter).");
  } else {
    var componentName = userArgs[0];
    fs.access(componentName, fs.F_OK, function (err) {
      if (err) {
        fs.mkdirSync(componentName);
      }
    });

    var componentFile = componentName + "/" + componentName + ".js";
    fs.access(componentFile, fs.F_OK, function (err) {
      if (err) {
        var component = "";
        component += componentName + "({\n";
        component += "  name: '',\n";
        component += "  render() {\n";
        component += "    <div>\n";
        component += "      <span b=\"text: name\" />\n";
        component += "    </div>\n";
        component += "  }\n";
        component += "});";

        fs.writeFile(componentFile, component, function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("Created file " + componentFile);
          }
        });

      } else {
        console.warn("Skipping file " + componentFile + " because it already exists.");
      }
    });

    var testFile = componentName + "/" + componentName + ".test.js";
    fs.access(testFile, fs.F_OK, function (err) {
      if (err) {
        var componentVariable = componentName.substr(0, 1).toLowerCase() + componentName.substr(1);
        var test = "";
        test += "import React from 'react';\n";
        test += "import { shallow } from 'enzyme';\n";
        test += "import { " + componentName + " } from './" + componentName + "';\n";
        test += "\n";
        test += "describe('" + componentName + "', () => {\n";
        test += "\n";
        test += "  describe('view model', () => {\n";
        test += "    let " + componentVariable + ";\n";
        test += "    beforeEach(() => {\n";
        test += "      " + componentVariable + " = new " + componentName + "();\n";
        test += "    });\n";
        test += "\n";
        test += "    describe('name', () => {\n";
        test += "      it(\"defaults to ''\", () => {\n";
        test += "        expect(" + componentVariable + ".name()).toBe('');\n";
        test += "      });\n";
        test += "\n";
        test += "      it(\"is valid with 'A'\", () => {\n";
        test += "        " + componentVariable + ".name('A');\n";
        test += "        expect(" + componentVariable + ".name.valid()).toBe(true);\n";
        test += "      });\n";
        test += "    });\n";
        test += "  });\n";
        test += "\n";
        test += "  describe('bindings', ()=>{\n";
        test += "    let rendered;\n";
        test += "    beforeEach(() => {\n";
        test += "      rendered = rendered = shallow(<" + componentName + " />);\n";
        test += "    });\n";
        test += "\n";
        test += "    it(\"binds span\", ()=>{\n";
        test += "      const elements = rendered.find('span[data-bind=\"text: name\"]');\n";
        test += "      expect(elements.length).toBe(1);\n";
        test += "    })\n";
        test += "  })\n";
        test += "  \n";
        test += "});";

        fs.writeFile(testFile, test, function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("Created file " + testFile);
          }
        });
      } else {
        console.warn("Skipping file " + testFile + " because it already exists.");
      }
    });
  }
};

exports.createViewModel = createViewModel;