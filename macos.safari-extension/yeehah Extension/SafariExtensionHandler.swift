//
//  SafariExtensionHandler.swift
//  yeehah Extension
//
//  Created by Kevin Carmody on 22/05/2020.
//

import SafariServices

class SafariExtensionHandler: SFSafariExtensionHandler {
        
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        // This method will be called when a content script provided by your extension calls safari.extension.dispatchMessage("message").
        
        NSLog("The extension received a message (\(messageName)) with userInfo (\(userInfo ?? [:]))")
        
        if messageName == "UDGetItem" {
            if let unwrappedUserInfo = userInfo as? [String : String]  {
                let key = unwrappedUserInfo["key"]!
                let value = UserDefaults.standard.string(forKey: key)
                page.dispatchMessageToScript(withName: "UDGetItem", userInfo: ["key": key, "value": value as Any])
                
                NSLog("\(messageName) for \(key)")
            }
        }
        
        if messageName == "UDSetItem" {
            if let unwrappedUserInfo = userInfo as? [String : String]  {
                let key = unwrappedUserInfo["key"]!
                let value = unwrappedUserInfo["value"]!
                UserDefaults.standard.set(value, forKey: key)
                page.dispatchMessageToScript(withName: "UDSetItem", userInfo: ["key": key, "value": value as Any])
                
                NSLog("\(messageName) for \(key) with \(value)")
            }
        }
        
        if messageName == "UDRemoveItem" {
            if let unwrappedUserInfo = userInfo as? [String : String]  {
                let key = unwrappedUserInfo["key"]!
                UserDefaults.standard.removeObject(forKey: key)
                page.dispatchMessageToScript(withName: "UDRemoveItem", userInfo: ["key": key])
                
                NSLog("\(messageName) for \(key)")
            }
        }
        
    }
    
    override func toolbarItemClicked(in window: SFSafariWindow) {
        // This method will be called when your toolbar item is clicked.
        NSLog("The extension's toolbar item was clicked")

        // open url
        let url = NSURL(string: "https://whotargets.me/en/")! as URL
        window.openTab(with: url, makeActiveIfPossible: true)

        // btw, this would open it in the default browser e.g. firefox
        // NSWorkspace.shared.open(url)
    }
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        // This is called when Safari's state changed in some way that would require the extension's toolbar item to be validated again.
        validationHandler(true, "")
    }
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }

}
