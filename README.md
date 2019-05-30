# React Native Slide To Confirm
A simple react-native component that let user slide to confirm.

## Install

```bash
yarn add react-native-slide-to-confirm
```

## Usage

```js
import React, {Component} from 'react';
import { View, TouchableOpacity, Text} from 'react-native';
import SlideToConfirm from 'react-native-slide-to-confirm';

export default class App extends Component {
  render() {
    return (
      <View style={{flex:1,justifyContent:'space-around',alignItems:'center'}}>
        <SlideToConfirm
          ref={ref => this.slideRef = ref}
          width={300}
          onConfirm={()=>{
            console.log('on user confirm')
          }}
          textColor='white'
          pathColor='red'
          pathCoverColor='red'
          sliderColor='white'
          text='Slide To Purchase'
        />
        <TouchableOpacity
          onPress={() => {
            this.slideRef.reset()
          }}
          style={{padding:10,borderWidth: 1, borderColor: 'gray'}}
        >
          <Text>reset</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

```

## Contributors

andytai <andytai@gmail.com>
