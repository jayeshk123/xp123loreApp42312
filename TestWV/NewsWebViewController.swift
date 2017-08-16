//
//  NewsWebViewController.swift
//  TestWV
//
//  Created by earth on 19/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import Cordova

class NewsWebViewController: CDVViewController  {
    
    override func viewDidLoad() {
        
        // Do any additional setup after loading the view, typically from a nib.
        //let viewController =  CDVViewController()
        self.wwwFolderName = "/www";
        self.startPage = "news.html"
        
        
        let rect = CGRect(x: 0, y: 0, width: 100, height: 100)
        self.view.frame = rect;
        self.view.backgroundColor = UIColor.black
        super.viewDidLoad()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillLayoutSubviews() {
        
    }
    
    
}
