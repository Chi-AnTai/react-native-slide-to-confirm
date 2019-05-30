import React from 'react';
import { View, Text, PanResponder, Animated, Easing } from 'react-native';

export default class SlideToConfirm extends React.Component {
  static defaultProps = {
    width:300,
    height:50,
    threshold: 5,
    sliderColor: 'purple',
    pathColor: 'white',
    pathCoverColor: 'red',
    textColor: 'black',
    text: '',
    enableSlide: true,
    enableLoadingAnimation: false
  }

  constructor(props) {
    super(props)
    this.state = {
      enableSlide: props.enableSlide,
      enableLoadingAnimation: props.enableLoadingAnimation
    }

    this.animatedLeftWidth = new Animated.Value(this.props.height/2)
    this.animatedWidth = new Animated.Value(this.props.width)
    this.loadingAnimatedValue = new Animated.Value(0)
    this.setPanResponder()
  }

  setPanResponder = () => {
    let props = this.props
    this.slideControl = PanResponder.create({
      onMoveShouldSetPanResponder:(evt, gestureState) => {
        return this.state.enableSlide
      },
      onPanResponderMove: Animated.event([null, { dx: this.animatedLeftWidth }],{listener: (event, gestureState) => {
        if(gestureState.dx >= props.width-props.height/2) this.animatedLeftWidth.setValue(props.width-props.height/2)
        if(gestureState.dx < props.height/2) this.animatedLeftWidth.setValue(props.height/2)
      }}),
      onPanResponderRelease: () => {
        if(this.animatedLeftWidth._value >= props.width - props.height/2 - props.threshold) {
          this.setState({enableSlide: false})
          Animated.parallel([
            Animated.timing(this.animatedLeftWidth,{
              toValue: props.height/2,
              duration: 500
            }),
            Animated.timing(this.animatedWidth,{
              toValue: props.height,
              duration: 500
            }),
          ]).start(this.onConfirm)
        } else Animated.timing(this.animatedLeftWidth,{
          toValue: props.height/2,
          duration: 500
        }).start()
      }
    })
  }

  onConfirm = () => {
    this.setState({enableSlide: true})
    if(this.state.enableLoadingAnimation) {
      Animated.loop(Animated.timing(this.loadingAnimatedValue,{
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true
      })).start();
    }
    this.props.onConfirm()
  }

  reset = () => {
    Animated.timing(
      this.loadingAnimatedValue
    ).stop();
    this.animatedLeftWidth.setValue(this.props.height/2)
    this.animatedWidth.setValue(this.props.width) 
    this.loadingAnimatedValue.setValue(0)
  }

  render() {
    let rotate = this.loadingAnimatedValue.interpolate({
      inputRange: [0,1],
      outputRange: ['0deg','360deg']
    })
    return (
      <View style={{width:this.props.width,alignItems:'center'}}>
        <Animated.View style={{width:this.animatedWidth,height:this.props.height,borderWidth:0,borderColor:'gray',borderRadius:this.props.height/2,flexDirection:'row',overflow:'hidden',backgroundColor:this.props.pathColor}}>
          <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:this.props.textColor}}>{this.props.text}</Text>
          </View>
          <Animated.View style={{height:this.props.height,backgroundColor:this.props.pathCoverColor,width:this.animatedLeftWidth}}></Animated.View>
          <Animated.View
            {...this.slideControl.panHandlers}
            style={{backgroundColor:this.props.sliderColor,width:this.props.height-6,height:this.props.height-6,borderRadius:(this.props.height-6)/2,marginLeft:-this.props.height/2,alignItems:'center',justifyContent:'center', left: 3, top: 3,transform:[{rotate:rotate}]}}
          >
          </Animated.View>
        </Animated.View>
      </View>

    )
  }
}
