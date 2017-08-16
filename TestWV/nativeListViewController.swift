//
//  nativeListViewController.swift
//  TestWV
//
//  Created by earth on 28/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB

class nativeListViewController: UITableViewController {

    override func viewDidLoad() {
        
        
        self.definesPresentationContext = true
        super.viewDidLoad()
        
    }
    
    override func viewDidAppear(_ animated: Bool) {
        
        
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
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
        //self.view.backgroundColor = UIColor(patternImage: UIImage(named: "header_bg")!)
        /* var rect = self.tabBar.frame
         //CGRect(x: 0, y: 0, width: 100, height: 100)
         //self.TabBar is IBOutlet of your TabBar
         rect.size.height = 500;
         rect.origin.y = self.view.frame.size.height - 80;
         self.tabBar.frame = rect;*/
    }

    /*
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "reuseIdentifier", for: indexPath)

        // Configure the cell...

        return cell
    }
    */

    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
