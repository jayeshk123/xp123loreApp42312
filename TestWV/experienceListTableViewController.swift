//
//  experienceListTableViewController.swift
//  TestWV
//
//  Created by earth on 03/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB
import NVActivityIndicatorView
import Alamofire
import SwiftyJSON
import Toaster

struct Sections{
    var name:String
    var location:String
    var distance:String
    var status:String
    var image:String
    var lattitude:String
    var longitude:String
    var description:String
}

class experienceListTableViewController: UITableViewController, NVActivityIndicatorViewable {

    var URL = "http://34.231.31.72/xplore/index.php"
    var sections:[Sections] = []
    private var dragView: UIView?
    @IBOutlet weak var dropZone: UIView!
    
    var dbQueue: DatabaseQueue!
    
    func setUpDatabasePath()
    {
        let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first! as NSString
        let databasePath = documentsPath.appendingPathComponent("sqliteDB.sqlite")
        print("DATABASE PATH !!!!")
        print(databasePath)
        let fileManager:FileManager = FileManager.default
        var success = fileManager.fileExists(atPath: databasePath)
        if (success)
        {
            dbQueue = try! DatabaseQueue(path: databasePath)
            print("writing to documents directory")
            print(databasePath)
            //break
            return
        }
        
        if (!success)
        {
            let bundlePath = Bundle.main.path(forResource: "sqliteDB", ofType: "sqlite")
            success = fileManager.fileExists(atPath: bundlePath!)
            print("writing from app bundle")
            if (success)
            {
                try! fileManager.copyItem(atPath: bundlePath!, toPath: databasePath)
                dbQueue = try! DatabaseQueue(path: databasePath)
            }
            else
            {
                print("Could not find database")
            }
            return
        }
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpDatabasePath()
        getSections()
        tableView.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
        
        
        /*let longpress = UILongPressGestureRecognizer(target: self, action: "longPressGestureRecognized:")
        tableView.addGestureRecognizer(longpress)*/
        
        
        
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }
    
   /* func longPressGestureRecognized(gestureRecognizer: UIGestureRecognizer) {
        let longPress = gestureRecognizer as! UILongPressGestureRecognizer
        let state = longPress.state
        var locationInView = longPress.location(in: tableView)
        var indexPath = tableView.indexPathForRow(at: locationInView)
        
        struct My {
            static var cellSnapshot : UIView? = nil
        }
        struct Path {
            static var initialIndexPath : NSIndexPath? = nil
        }
        
        switch state {
        case UIGestureRecognizerState.began:
            if indexPath != nil {
                Path.initialIndexPath = tableView.indexPathForRow(at: locationInView) as! NSIndexPath
                let cell = self.tableView.cellForRow(at: indexPath!) as UITableViewCell!
                My.cellSnapshot  = snapshopOfCell(inputView: cell!)
                var center = cell?.center
                My.cellSnapshot!.center = center!
                My.cellSnapshot!.alpha = 0.0
                self.tableView.addSubview(My.cellSnapshot!)
                
                UIView.animate(withDuration: 0.25, animations: { () -> Void in
                    center?.y = locationInView.y
                    My.cellSnapshot!.center = center!
                    My.cellSnapshot!.transform = CGAffineTransform(scaleX: 1.05, y: 1.05)
                    My.cellSnapshot!.alpha = 0.98
                    cell?.alpha = 0.0
                    
                }, completion: { (finished) -> Void in
                    if finished {
                        cell?.isHidden = true
                    }
                })
            }
        case UIGestureRecognizerState.changed:
            var center = My.cellSnapshot!.center
            center.y = locationInView.y
            My.cellSnapshot!.center = center
            if ((indexPath != nil) && (indexPath != Path.initialIndexPath)) {
                swap(&itemsArray[indexPath!.row], &itemsArray[Path.initialIndexPath?.row])
                tableView.moveRow(at: Path.initialIndexPath! as IndexPath, to: indexPath!)
                Path.initialIndexPath = indexPath as? IndexPath as! NSIndexPath
            }
            
        default:
            let cell = tableView.cellForRow(at: Path.initialIndexPath! as IndexPath) as UITableViewCell!
            cell?.isHidden = false
            cell?.alpha = 0.0
            UIView.animate(withDuration: 0.25, animations: { () -> Void in
                My.cellSnapshot!.center = (cell?.center)!
                My.cellSnapshot!.transform = .identity
                My.cellSnapshot!.alpha = 0.0
                cell?.alpha = 1.0
            }, completion: { (finished) -> Void in
                if finished {
                    Path.initialIndexPath = nil
                    My.cellSnapshot!.removeFromSuperview()
                    My.cellSnapshot = nil
                }
            })
        }
    }*/

    /*func snapshopOfCell(inputView: UIView) -> UIView {
        UIGraphicsBeginImageContextWithOptions(inputView.bounds.size, false, 0.0)
        inputView.layer.render(in: UIGraphicsGetCurrentContext()!)
        let image = UIGraphicsGetImageFromCurrentImageContext()!
        UIGraphicsEndImageContext()
        let cellSnapshot : UIView = UIImageView(image: image)
        cellSnapshot.layer.masksToBounds = false
        cellSnapshot.layer.cornerRadius = 0.0
        cellSnapshot.layer.shadowOffset = CGSize(width: -5.0, height: 0.0)
        cellSnapshot.layer.shadowRadius = 5.0
        cellSnapshot.layer.shadowOpacity = 0.4
        return cellSnapshot
    }*/
    
    public func getSections(){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            var elCount:Int
            elCount = 0
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM experience")! // Int
                
                print("Count : \(elCount)")
                
            }
            
            
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM experience")
                    while let row = try rows.next() {
                        let name: String = row.value(named: "name")
                        let location: String = row.value(named: "location")
                        let distance: String = row.value(named: "distance")
                        let status: String = row.value(named: "status")
                        let lattitude: String = row.value(named: "lattitude")
                        let longitude: String = row.value(named: "longitude")
                        let description: String = row.value(named: "description")
                        let image: String = row.value(named: "image")
                        
                        sections.append(Sections(name: name, location: location, distance: distance, status: status, image : image,lattitude:lattitude, longitude:longitude,description:description))
                    }
                    
                }
            }
            
            print(sections)
            
        } catch {
            print(error.localizedDescription)
        }
    }
    
    func getSelected() -> Int{
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            var elCount:Int
            elCount = 0
            try dbQueue.inDatabase { db in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM experience where selected = '1'")! // Int
                
                print("Count : \(elCount)")
                
            }
            return elCount
            
        } catch {
            print(error.localizedDescription)
            return 0
        }
    }
    
    func addNavigationPoint(index:String){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                try db.execute(
                    "update experience set selected = '1' where id = ?",
                    arguments: [index])
            }
            
        } catch {
            print(error.localizedDescription)
        }
    }
    
    func checkIfAdded(index:String) -> Bool{
        do {
            var sections = [String]()
            try dbQueue.inDatabase { db in
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM experience where id = ?", arguments:[index])
                
                while let row = try rows.next() {
                    let sectionName: String = row.value(named: "selected")
                    sections.append(sectionName)
                }
            }
            if sections.count > 0{
                if sections[0] == "0" {
                    return false
                }else{
                    return true
                }
            }else{
                return false
            }
            
        } catch {
            print(error.localizedDescription)
            return false
        }
    }
    
    func removeAdded(index:String){
        do {
            try dbQueue.inDatabase { db in
                try db.execute(
                    "update experience set selected = '0' where id = ?",
                    arguments: [index])
            }
            
        } catch {
            print(error.localizedDescription)
        }
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
        return sections.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = Bundle.main.loadNibNamed("ShowListSubSectionsTableViewCell", owner: self, options: nil)?.first as! ShowListSubSectionsTableViewCell
        
        //cell.backgroundColor = UIColor.black
        let imageUrl = NSURL(string: "https://s3.amazonaws.com/retail-safari/"+sections[indexPath.row].image)! as URL
        print("Download Started")
        getDataFromUrl(url: imageUrl) { (data, response, error)  in
            guard let data = data, error == nil else { return }
            print(response?.suggestedFilename ?? imageUrl.lastPathComponent)
            print("Download Finished")
            DispatchQueue.main.async() { () -> Void in
                cell.leftImage.image = UIImage(data: data)
                cell.leftImage.contentMode = .scaleAspectFit
            }
        }
        print("End of code. The image will continue downloading in the background and it will be loaded when it ends.")
        let verify = checkIfAdded(index: "\(indexPath.row + 1)")
        if verify == true {
            cell.rightImage.image = UIImage(named: "tick-list")
        }else{
            cell.rightImage.image = nil
        }
        
        cell.titleLabel.text = sections[indexPath.row].name
        cell.locationLabel.text = sections[indexPath.row].location
        cell.distanceLabel.text = sections[indexPath.row].distance
        cell.statusLabel.text = sections[indexPath.row].status
        
        /*let lpGestureRecognizer: UILongPressGestureRecognizer = UILongPressGestureRecognizer(target: self, action: #selector(didLongPressCell))
        cell.contentView.addGestureRecognizer(lpGestureRecognizer)*/
        
        return cell

    }
    
    /*func didLongPressCell (recognizer: UILongPressGestureRecognizer) {
        switch recognizer.state {
        case .began:
            if let cellView: UIView = recognizer.view {
                cellView.frame.origin = CGPoint.zero
                dragView = cellView
                view.addSubview(dragView!)
            }
        case .changed:
            dragView?.center = recognizer.location(in: view)
        case .ended:
            if (dragView == nil) {return}
            
            if (dragView!.frame.intersects(dropZone.frame)) {
                if let cellView: UIView = (dragView?.subviews[0])! as UIView {
                    cellView.frame.origin = CGPoint.zero
                    dropZone.addSubview(cellView)
                }
                
                dragView?.removeFromSuperview()
                dragView = nil
                
                //Delete row from UITableView if needed...
            } else {
                //DragView was not dropped in dropszone... Rewind animation...
            }
        default:
            print("Any other action?")
        }
    }*/
    
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        return true
    }
    
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if (editingStyle == UITableViewCellEditingStyle.delete) {
            
            // handle delete (by removing the data from your array and updating the tableview)
        }
    }
    
    override func tableView(_ tableView: UITableView, editActionsForRowAt indexPath: IndexPath) -> [UITableViewRowAction]? {
        var delete = UITableViewRowAction(style: UITableViewRowActionStyle.default, title: "Delete" , handler: { (action:UITableViewRowAction!, indexPath:IndexPath!) -> Void in
            //Do something
            print("DELETE TEST")
            print(indexPath.row)
        })
        
        delete.backgroundColor = UIColor.red
        
        var more = UITableViewRowAction(style: UITableViewRowActionStyle.default, title: "Mark Visited" , handler: { (action:UITableViewRowAction!, indexPath:IndexPath!) -> Void in
            //Do something
            print("Mark as Visited TEST")
            print(indexPath.row)
        })
        more.backgroundColor = UIColor.blue
        //more.backgroundColor = UIColor(patternImage: UIImage(named: "up")!)
        
        return [delete, more]
    }
    
    func getDataFromUrl(url: URL, completion: @escaping (_ data: Data?, _  response: URLResponse?, _ error: Error?) -> Void) {
        URLSession.shared.dataTask(with: url) {
            (data, response, error) in
            completion(data, response, error)
            }.resume()
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 60.0
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        let verify = checkIfAdded(index: "\(indexPath.row + 1)")
        if verify == true {
            removeAdded(index: "\(indexPath.row + 1)")
            tableView.reloadData()
        }else{
            let count = getSelected()
            if count >= 2 {
                Toast(text: "You have already selected two points to navigate").show()
            }else if count < 2{
                addNavigationPoint(index: "\(indexPath.row + 1)")
                tableView.reloadData()
            }else{
                print("count is exact \(count)")
            }
        }
        
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
