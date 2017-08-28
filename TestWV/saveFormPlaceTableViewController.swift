//
//  saveFormPlaceTableViewController.swift
//  TestWV
//
//  Created by earth on 17/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit

class saveFormPlaceTableViewController: UITableViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
        
        let button = UIButton.init(type: .custom)
        button.setImage(UIImage.init(named: "hamburger_menu"), for: UIControlState.normal)
        /*button.addTarget(self, action:#selector(ViewController.callMethod), for: UIControlEvents.touchUpInside)*/
        button.frame = CGRect.init(x: 0, y: 0, width: 30, height: 30) //CGRectMake(0, 0, 30, 30)
        let barButton = UIBarButtonItem.init(customView: button)
        self.navigationItem.leftBarButtonItem = barButton
        
        let button1 = UIButton.init(type: .custom)
        button1.setImage(UIImage.init(named: "user_top_right"), for: UIControlState.normal)
        /*button.addTarget(self, action:#selector(ViewController.callMethod), for: UIControlEvents.touchUpInside)*/
        button1.frame = CGRect.init(x: 0, y: 0, width: 30, height: 30) //CGRectMake(0, 0, 30, 30)
        let barButton1 = UIBarButtonItem.init(customView: button1)
        self.navigationItem.rightBarButtonItem = barButton1
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return 2
    }
    
    override func viewWillLayoutSubviews() {
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 150, height: 40))
        imageView.contentMode = .scaleAspectFit
        
        let image = UIImage(named: "logo")
        imageView.image = image
        
        self.navigationItem.titleView = imageView
        UINavigationBar.appearance().setBackgroundImage(UIImage(named: "header_bg")!.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .stretch), for: .default)
        //self.view.backgroundColor = UIColor(patternImage: UIImage(named: "header_bg")!)
        /* var rect = self.tabBar.frame
         //CGRect(x: 0, y: 0, width: 100, height: 100)
         //self.TabBar is IBOutlet of your TabBar
         rect.size.height = 500;
         rect.origin.y = self.view.frame.size.height - 80;
         self.tabBar.frame = rect;*/
    }

}
