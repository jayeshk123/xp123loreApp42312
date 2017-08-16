//
//  DealsViewController.swift
//  TestWV
//
//  Created by earth on 20/07/17.
//  Copyright © 2017 earth. All rights reserved.
//



import UIKit
import Cordova

class DealsViewController: UITableViewController  {
    
    //@IBOutlet weak var topBar: UINavigationBar!
    //@IBOutlet weak var tabBar: UITabBar!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
    }
    
    override func viewDidAppear(_ animated: Bool) {
        
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillLayoutSubviews() {
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 150, height: 40))
        imageView.contentMode = .scaleAspectFit
        
        let image = UIImage(named: "logo")
        imageView.image = image
        
        navigationItem.titleView = imageView
        UINavigationBar.appearance().setBackgroundImage(UIImage(named: "header_bg")!.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .stretch), for: .default)
        /* var rect = self.tabBar.frame
         //CGRect(x: 0, y: 0, width: 100, height: 100)
         //self.TabBar is IBOutlet of your TabBar
         rect.size.height = 500;
         rect.origin.y = self.view.frame.size.height - 80;
         self.tabBar.frame = rect;*/
    }
}
