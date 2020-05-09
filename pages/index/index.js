//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    uuid: '3C6E5EE2-7449-D227-034F-FA3F9444E215',
    service: '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
    indicate: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E',
    write: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'
  },
  //转为16进制字符串显示
  ab2hex: function (buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },
  onLoad: function () {
  

  },
  //启动适配器
  adapter: function (event) {
    wx.openBluetoothAdapter({
      success(res) {
        console.log('adapter success')
      }
    })
  },
  //开始查找
  start: function () {
    wx.startBluetoothDevicesDiscovery({
      success(res) {
        console.log('start', res)
      },
      fail(err) {
        console('start fail', err)
      }
    })
    //监听查找结果
    wx.onBluetoothDeviceFound((res) => {
      var devices = res.devices;
      console.log('new device list has founded')
      console.dir(devices)
      console.log("RSSI:" + devices[0].RSSI, "deviceId:" + devices[0].deviceId, "name:" + devices[0].name)
      // console.log(this.ab2hex(devices[0].advertisData))
    })


  },
  //停止查找
  stop: function () {
    wx.stopBluetoothDevicesDiscovery({
      success(res) {
        console.log('stop', res)
      }
    })
  },
  connect: function () {
    wx.createBLEConnection({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: this.data.uuid,
      success(res) {
        console.log("create success", res)
      },
      fail(err) {
        console.log('create fail', err)
      }
    })
  },
  close: function () {
    wx.closeBLEConnection({
      deviceId: this.data.uuid,
      success(res) {
        console.log(res)
      }
    })
  },
  //获取该蓝牙提供的所有服务
  services: function () {
    wx.getBLEDeviceServices({
      deviceId: this.data.uuid,
      success(res) {
        console.log('device services:', res.services)
      }
    })
  },
  //获取所有特征值
  characteristic: function () {
    wx.getBLEDeviceCharacteristics({
      deviceId: this.data.uuid,
      serviceId: this.data.service,
      success(res) {
        console.log('characteristics success', res.characteristics)
      }
    })
  },
  read: function () {
    // 必须在这里的回调才能获取
    // wx.onBLECharacteristicValueChange(function (characteristic) {
/**
 * arraybuffer 转 字符串
let unit8Arr = new Uint8Array(arrayBuffer) ;
let encodedString = String.fromCharCode.apply(null, unit8Arr),
decodedString = decodeURIComponent(escape((encodedString)));//没有这一步中文会乱码
console.log(decodedString);
 */
      // console.log('characteristic value comed:', characteristic)
    // })
    wx.onBLECharacteristicValueChange(function(characteristic) {
      console.log('characteristic value comed:', characteristic)

      let unit8Arr = new Uint8Array(characteristic.value) ;
      let encodedString = String.fromCharCode.apply(null, unit8Arr),
      decodedString = decodeURIComponent(escape((encodedString)));//没有这一步中文会乱码
      console.log(decodedString);      
    })
    //读取
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: this.data.uuid,
      serviceId: this.data.service,
      characteristicId:this.data.indicate,
      success(res) {
        console.log('notifyBLECharacteristicValueChange:', res.errCode)
      },
      fail(err){
        console.log('notifyBLECharacteristicValueChange err',err)
      }
    })
  },
  //写入
  write: function () {

    let buffer = new ArrayBuffer(1)
    let dataView = new DataView(buffer)
    //换行符的ascii码（10）
    dataView.setUint8(0, 10)
    
    wx.writeBLECharacteristicValue({
      deviceId: this.data.uuid,
      serviceId: this.data.service,
      characteristicId:this.data.write,
      value: buffer,
      success (res) {
        console.log('writeBLECharacteristicValue success', res.errMsg)
      },
      fail(err){
        console.log('writeBLECharacteristicValue err',err)

      }
    })
  }

})
