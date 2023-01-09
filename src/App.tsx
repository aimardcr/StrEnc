import React from 'react';
import './App.css';
import Select from 'react-select';

const {useState} = React;

const languages = [
  { value: 'cpp', label: 'C / C++' }
];

const Operator = {
  Add: 0,
  Sub: 1,
  Xor: 2,
  Inc: 3,
  Dec: 4,
}

interface Operation {
  operator: number;
  value: number;
}

function App() {
  const [language, setLanguage] = useState('cpp');
  const [result, setResult] = useState('');

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

  const handleInput = (str: string) => {
    if (language === 'cpp') {
      var name = randomString(6);

      var last_rand = -1;
      var operations = []
      for (var i = 0; i < randomInt(5, 6); i++) {
        var rand = randomInt(0, 4);
        while (rand == last_rand) {
          rand = randomInt(0, 4);
        }
        var op: Operation = {
          operator: rand,
          value: randomInt(1, 126)
        };
        operations.push(op);
        last_rand = rand;
      }
      
      var data = new Uint8Array(str.length);
      for (var i = 0; i < str.length; i++) {
        data[i] = str.charCodeAt(i);

        for (var j = 0; j < operations.length; j++) {
          var op = operations[j];
          if (op.operator == 0) {
            data[i] = data[i] + op.value;
          } else if (op.operator == 1) {
            data[i] = (data[i] - op.value) & 0xFF;
          } else if (op.operator == 2) {
            data[i] = (data[i] ^ op.value) & 0xFF;
          } else if (op.operator == 3) {
            data[i] = data[i] + 1;
          } else if (op.operator == 4) {
            data[i] = data[i] - 1;
          }
        }
      }

      var res = '// ' + str + '\n';
      res += 'char ' + name + '[] = {';
      for (var i = 0; i < str.length; i++) {
        if (i != 0) {
          res += ', ';
        }
        res += '0x';
        res += data[i].toString(16).toUpperCase();
      }
      res += ', 0x00 };\n';
      res += 'for (int i = 0; i < sizeof(' + name + ') - 1; i++) {\n';
      for (var i = operations.length - 1; i >= 0; i--) {
        var op = operations[i];
        var nameI = name + '[i]';
        res += '  ';
        if (op.operator == 0) {
          res += nameI + ' -= 0x' + op.value.toString(16).toUpperCase();
        } else if (op.operator == 1) {
          res += nameI + ' += 0x' + op.value.toString(16).toUpperCase();
        } else if (op.operator == 2) {
          res += nameI + ' ^= 0x' + op.value.toString(16).toUpperCase();
        } else if (op.operator == 3) {
          res += nameI + '--';
        } else if (op.operator == 4) {
          res += nameI + '++';
        }
        res += ';\n';
      }
      res += '}\n';
      setResult(res);
    }
  };

  return (
    <div className='App'>
      <div className='main'>
        <span>String to Encrypt: </span>
        <input type='text' name='string' 
          onChange={(e) => {
            handleInput(e.target.value);
          }}
        />

        <span>Language: </span>
        <Select 
            options={languages}
            defaultValue={languages}
            onChange={(e) => {setLanguage(e?.value || '')}}
        />
        <pre>
        {result}
        </pre>
      </div>
    </div>
  );
}

export default App;
