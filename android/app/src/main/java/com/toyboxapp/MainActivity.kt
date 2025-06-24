package com.toyboxapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView

class MainActivity : ReactActivity() {
    override fun getMainComponentName(): String {
        return "ToyBoxApp"
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : DefaultReactActivityDelegate(
            this,
            mainComponentName,
            false // Disable Fabric
        ) {
            override fun createRootView(): RNGestureHandlerEnabledRootView {
                return RNGestureHandlerEnabledRootView(this.activity)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
    }
}