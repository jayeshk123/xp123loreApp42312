//
//  WebViewController.swift
//  TestWV
//
//  Created by earth on 18/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import Cordova
import NVActivityIndicatorView


class WebViewController: CDVViewController  {
    
    override func viewDidLoad() {
        //let activityData = ActivityData()
        
        //NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
        
        // Do any additional setup after loading the view, typically from a nib.
         //let viewController =  CDVViewController();
        self.view.backgroundColor = UIColor.black
        self.view.isOpaque = false
        self.wwwFolderName = "/www";
        self.startPage = "events.html"
        //self.webView.backgroundColor = UIColor.black
        
        let rect = CGRect(x: 0, y: 0, width: 100, height: 100)
        self.view.frame = rect;
        
        super.viewDidLoad()
        //NVActivityIndicatorPresenter.sharedInstance.setMessage("Done")
        //NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillLayoutSubviews() {
        
    }

    
    
}
