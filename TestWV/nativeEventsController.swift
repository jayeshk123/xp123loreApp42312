//
//  nativeEventsController.swift
//  TestWV
//
//  Created by earth on 24/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import Cordova
//import AZTabBar





class nativeEventsController: UITableViewController , UITabBarDelegate {
    

    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.definesPresentationContext = true
        
        tableView.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 150, height: 40))
        imageView.contentMode = .scaleAspectFit
        
        let image = UIImage(named: "logo")
        imageView.image = image
        
        navigationItem.titleView = imageView
        
    }
    
    override func viewDidAppear(_ animated: Bool) {
        
        
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    @IBAction func openListViewClicked(_ sender: UIButton) {
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "nativeListViewController")
        self.present(newViewController, animated: true, completion: nil)
    }
    
    /*override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 5
    }*/
    
    /*override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        code
    }*/
    
    /*override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if tableView == self.innerTableView {
            let cell = Bundle.main.loadNibNamed("nativeEventsTableViewCell", owner: self, options: nil)?.first as! nativeEventsTableViewCell
            //self.tableView.dequeueReusableCell(withIdentifier: "eventsCell", for: indexPath) as! nativeEventsTableViewCell
            
            //Bundle.main.loadNibNamed("nativeEventsTableViewCell", owner: self, options: nil)?.first as! nativeEventsTableViewCell
            
            _ = indexPath.row
            cell.eventTitle.text = "Title"
            cell.eventCost.text = "FREE"
            cell.eventLocation.text = "India"
            cell.eventDesc.text = "Short Description"
            cell.eventImage = nil
            return cell
        }
        else{
            let cell = UITableViewCell()
            return cell

        }
    }*/
    
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
    }
    
    
}
