//
//  SafariExtensionViewController.swift
//  yeehah Extension
//
//  Created by Kevin Carmody on 22/05/2020.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()

}
