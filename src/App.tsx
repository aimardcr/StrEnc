import * as React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, FormControl, FormLabel, InputLabel, Select, MenuItem, TextField, Theme, Slider } from '@mui/material';

const {useState, useEffect} = React;
// ========================= //
const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
});

const Marks = [
  {
    value: 1,
    label: '1',
  },
  {
    value: 25,
    label: '25',
  },
  {
    value: 50,
    label: '50',
  },
  {
    value: 75,
    label: '75',
  },
  {
    value: 100,
    label: '100',
  }
];

const Operator = {
  Add: 0,
  Sub: 1,
  Xor: 2,
  Inc: 3,
  Dec: 4,
  Inv: 5
}

interface Operation {
  operator: number;
  value: number;
  by_i: boolean;
}
// ========================= //
const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomString = (length: number) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (var i = 0; i < length; i++) {
      result += characters.charAt(randomInt(0, characters.length - 1));
  }
  return result;
};
// ========================= //
function App() {
  const [string, setString] = useState('Hello world!');
  const [language, setLanguage] = useState('cpp');
  const [name, setName] = useState('');
  const [operation, setOperation] = useState<number | number[]>(5);
  const [result, setResult] = useState('');

  useEffect(() => {
    encryptString();
  }, [string, language, name, operation]);

  const encryptString = () => {
    if (string.length == 0) {
      setResult('Please enter atleast 1 character...');
      return;
    }
    var operations = []

    var last_operator = -1;
    for (var i = 0; i < operation; i++) {
      let operator = randomInt(0, 5);
      while (
        operator == last_operator || 
        (operator == Operator.Inc && last_operator == Operator.Dec) || 
        (operator == Operator.Dec && last_operator == Operator.Add)) {
        operator = randomInt(0, 4); 
      }

      operations.push({
        operator: operator,
        value: randomInt(1, 126),
        by_i: randomInt(0, 1) ? true : false
      });
      last_operator = operator;
    }
    
    var data = new Uint8Array(string.length);
    for (var i = 0; i < string.length; i++) {
      data[i] = string.charCodeAt(i);

      for (var j = 0; j < operations.length; j++) {
        let op = operations[j];
        if (op.by_i) {
          op.value = i;
        }

        if (op.operator == Operator.Add) {
          data[i] = data[i] + op.value;
        } else if (op.operator == Operator.Sub) {
          data[i] = (data[i] - op.value) & 0xFF;
        } else if (op.operator == Operator.Xor) {
          data[i] = (data[i] ^ op.value) & 0xFF;
        } else if (op.operator == Operator.Inc) {
          data[i] = data[i] + 1;
        } else if (op.operator == Operator.Dec) {
          data[i] = data[i] - 1;
        } else if (op.operator == Operator.Inv) {
          data[i] = ~data[i];
        }
      }
    }

    if (language === 'cpp') {
      var name_var = name;
      if (name_var.length == 0) {
        name_var = randomString(6)
      }
      var i_var = randomString(3);

      var res = `// ${string}\n`;
      res += `char ${name_var}[] = { `;
      for (var i = 0; i < string.length; i++) {
          if (i != 0) {
            res += ', ';
          }
          res += '0x';
          res += data[i].toString(16).toUpperCase().padStart(2, '0');
      }

      res += ', 0x00 };\n';
      res += `for (int ${i_var} = 0; ${i_var} < ${string.length}; ${i_var}++) {\n`;

      for (var i = operations.length - 1; i >= 0; i--) {
        var op = operations[i];

        var value = '0x' + op.value.toString(16).toUpperCase().padStart(2, '0');
        if (op.by_i) {
          value = i_var;
        }

        res += `\t${name_var}[${i_var}]`;
        if (op.operator == 0) {
          res += ` -= ${value}`;
        } else if (op.operator == 1) {
          res += ` += ${value}`;
        } else if (op.operator == 2) {
          res += ` ^= ${value}`;
        } else if (op.operator == 3) {
          res += '--';
        } else if (op.operator == 4) {
          res += '++';
        } else if (op.operator == 5) {
          res += ` = ~${name_var}[${i_var}]`;
        }
        res += ';\n';
      }
      res += '}\n';

      setResult(res);
    }

    if (language === 'java') {
      var name_var = name;
      if (name_var.length == 0) {
        name_var = randomString(6)
      }
      var byte_var = randomString(6);
      var tmp_var = randomString(3);
      var i_var = randomString(3);

      var res = `// ${string}\n`;
      res += `String ${name_var} = "";\n`
      res += `byte[] ${byte_var} = new byte[] { `;
      for (var i = 0; i < string.length; i++) {
          if (i != 0) {
            res += ', ';
          }
          res += '(byte) 0x';
          res += data[i].toString(16).toUpperCase().padStart(2, '0');
      }

      res += ' };\n';
      res += `for (int ${i_var} = 0; ${i_var} < ${string.length}; ${i_var}++) {\n`;
      res += `\tbyte ${tmp_var} = ${byte_var}[${i_var}];\n`;
      for (var i = operations.length - 1; i >= 0; i--) {
        var op = operations[i];

        var value = '0x' + op.value.toString(16).toUpperCase().padStart(2, '0');
        if (op.by_i) {
          value = i_var;
        }

        res += `\t${tmp_var}`;
        if (op.operator == 0) {
          res += ` -= ${value}`;
        } else if (op.operator == 1) {
          res += ` += ${value}`;
        } else if (op.operator == 2) {
          res += ` ^= ${value}`;
        } else if (op.operator == 3) {
          res += '--';
        } else if (op.operator == 4) {
          res += '++';
        } else if (op.operator == 5) {
          res += ` = (byte) ~${tmp_var}`;
        }
        res += ';\n';
      }
      res += `\t${name_var} += (char)(${tmp_var});\n`;
      res += '}\n';

      setResult(res);
    }

    if (language === 'python3') {
      var name_var = name;
      if (name_var.length == 0) {
        name_var = randomString(6)
      }
      var i_var = randomString(3);
      var data_var = randomString(6);
      var tmp_var = randomString(6);

      var res = `# ${string}\n`;
      res += `${name_var} = ''\n`;
      res += `${data_var} = bytes([`;
      for (var i = 0; i < string.length; i++) {
          if (i != 0) {
            res += ', ';
          }
          res += '0x';
          res += data[i].toString(16).toUpperCase().padStart(2, '0');
      }
      res += '])\n';
      res += `for ${i_var} in range(len(${data_var})): \n`;
      res += `\t${tmp_var} = ${data_var}[${i_var}]\n`;
      for (var i = operations.length - 1; i >= 0; i--) {
        var op = operations[i];

        var value = '0x' + op.value.toString(16).toUpperCase().padStart(2, '0');
        if (op.by_i) {
          value = i_var;
        }

        res += `\t${tmp_var}`;
        if (op.operator == 0) {
          res += ` -= ${value}`;
        } else if (op.operator == 1) {
          res += ` += ${value}`;
        } else if (op.operator == 2) {
          res += ` ^= ${value}`;
        } else if (op.operator == 3) {
          res += ' -= 1';
        } else if (op.operator == 4) {
          res += ' += 1';
        } else if (op.operator == 5) {
          res += ` = ~${tmp_var}`;
        }
        res += '\n';
      }
      res += `\t${name_var} += chr(${tmp_var} & 0xFF)\n`;

      setResult(res);
    }
  };

  return (
    <ThemeProvider theme={DarkTheme}>
      <CssBaseline />
      <Container sx={{py: 2, border: 1, borderRadius: 1}} maxWidth="sm">
        <FormLabel>String Encrypt</FormLabel>
        <FormControl sx={{my: 2}} fullWidth>
          <TextField id="string" label="String" variant="outlined" placeholder='Enter your string here.' 
            onChange={(e) => setString(e?.target.value)}
          />
        </FormControl>

        <FormControl sx={{ my: 2 }} fullWidth>
          <InputLabel id="language">Language</InputLabel>
          <Select labelId="language" id="language" label="Language" value={language}
            onChange={(e) => setLanguage(e?.target.value || '')}
          >
            <MenuItem value={'cpp'}>C / C++</MenuItem>
            <MenuItem value={'java'}>Java</MenuItem>
            <MenuItem value={'python3'}>Python3</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{my: 2}} fullWidth>
          <TextField id="name" label="Name" variant="outlined" placeholder='Enter your string name here. (Empty for random)' 
            onChange={(e) => setName(e?.target.value)}
          />
        </FormControl>

        <FormControl sx={{ my: 2 }} fullWidth>
          <FormLabel>Operation Count: </FormLabel>
          <Slider defaultValue={5} min={1} max={100} value={operation} marks={Marks} aria-label="Operations" valueLabelDisplay="auto" 
            onChange={(e, v) => setOperation(v)}
          />
        </FormControl>
        
        <TextField value={result} maxRows={10} aria-readonly multiline fullWidth></TextField>
      </Container>
    </ThemeProvider>
  );
}

export default App;
