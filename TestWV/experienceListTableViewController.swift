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
import CoreLocation

struct Sections{
    var name:String
    var location:String
    var distance:String
    var status:String
    var image:String
    var lattitude:String
    var longitude:String
    var description:String
    var index:String
}

class experienceListTableViewController: UITableViewController, NVActivityIndicatorViewable, CLLocationManagerDelegate {

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
        
        self.getSections()
        
        tableView.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
        
        //self.tableView.isEditing = true
        //self.navigationItem.rightBarButtonItem = self.editButtonItem
        
    }
    
   
    
    public func getSections(){
        do {
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
                        let index: String = row.value(named: "uniqueId")
                        
                        
                        
                       /* let latt : Double = Double(lattitude)!
                        let longg : Double = Double(longitude)!
                        let coordinate₀ = CLLocation(latitude: latt, longitude: longg)
                        let coordinate₁ = CLLocation(latitude: self.latCenter!, longitude: self.longCenter!)
                        
                        let distanceInMeters = coordinate₀.distance(from: coordinate₁) // result is in meters
                        let distInMiles = distanceInMeters / 1609
                        let dist:String = String(format:"%.2f mi away", distInMiles)*/
                        
                        sections.append(Sections(name: name, location: location, distance: distance, status: status, image : image,lattitude:lattitude, longitude:longitude,description:description,index:index))
                    }
                    
                }
            }
            
            print(sections)
            
        } catch {
            print(error.localizedDescription)
        }
    }
    
    public func getSections(index:Int){
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
                        let index: String = row.value(named: "uniqueId")
                        
                       /* let latt : Double = Double(lattitude)!
                        let longg : Double = Double(longitude)!
                        let coordinate₀ = CLLocation(latitude: latt, longitude: longg)
                        let coordinate₁ = CLLocation(latitude: self.latCenter!, longitude: self.longCenter!)
                        
                        let distanceInMeters = coordinate₀.distance(from: coordinate₁) // result is in meters
                        let distInMiles = distanceInMeters / 1609
                        let dist:String = String(format:"%.2f mi away", distInMiles)*/
                        
                        sections.append(Sections(name: name, location: location, distance: distance, status: status, image : image,lattitude:lattitude, longitude:longitude,description:description, index:index))
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
                    "update experience set selected = '1' where uniqueId = ?",
                    arguments: [index])
            }
            
        } catch {
            print(error.localizedDescription)
        }
    }
    
    func removeExpPoint(index:String){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                try db.execute(
                    "delete from experience where uniqueId = ?",
                    arguments: [index])
                
                try db.execute(
                    "delete from selectedPlaces where uniqueId = ?",
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
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM experience where uniqueId = ?", arguments:[index])
                
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
        let verify = checkIfAdded(index: "\(sections[indexPath.row].index)")
        if verify == true {
            cell.rightImage.image = UIImage(named: "tick-list")
        }else{
            cell.rightImage.image = nil
        }
        
        cell.titleLabel.text = sections[indexPath.row].name
        cell.locationLabel.text = sections[indexPath.row].location
        cell.distanceLabel.text = sections[indexPath.row].distance
        cell.statusLabel.text = sections[indexPath.row].status
        cell.leftImage.layer.cornerRadius = 10.0
        cell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        /*let lpGestureRecognizer: UILongPressGestureRecognizer = UILongPressGestureRecognizer(target: self, action: #selector(didLongPressCell))
        cell.contentView.addGestureRecognizer(lpGestureRecognizer)*/
        
        return cell

    }
    
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        return true
    }
    
    override func tableView(_ tableView: UITableView, editingStyleForRowAt indexPath: IndexPath) -> UITableViewCellEditingStyle {
        if self.tableView.isEditing == true{
            return .none
        }else{
            return .delete
        }
    }
    
    override func tableView(_ tableView: UITableView, shouldIndentWhileEditingRowAt indexPath: IndexPath) -> Bool {
        return false
    }
    
    override func tableView(_ tableView: UITableView, moveRowAt sourceIndexPath: IndexPath, to destinationIndexPath: IndexPath) {
        //let movedObject = self.fruits[sourceIndexPath.row]
        //fruits.remove(at: sourceIndexPath.row)
        //fruits.insert(movedObject, at: destinationIndexPath.row)
        print(sourceIndexPath.row)
        print(destinationIndexPath.row)
        // To check for correctness enable: self.tableView.reloadData()
    }
    
   /* override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        //let rowData = fruits[indexPath.row]
        return rowData.hasPrefix("A")
    }*/
    
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if (editingStyle == UITableViewCellEditingStyle.delete) {
            
            // handle delete (by removing the data from your array and updating the tableview)
        }
    }
    
    override func tableView(_ tableView: UITableView, editActionsForRowAt indexPath: IndexPath) -> [UITableViewRowAction]? {
        let delete = UITableViewRowAction(style: UITableViewRowActionStyle.default, title: "\u{274C}\n Delete" , handler: { (action:UITableViewRowAction!, indexPath:IndexPath!) -> Void in
            //Do something
            let refreshAlert = UIAlertController(title: "Delete", message: "Are you sure you want to remove this place from experience?+.", preferredStyle: UIAlertControllerStyle.alert)
            
            refreshAlert.addAction(UIAlertAction(title: "Delete", style: .default, handler: { (action: UIAlertAction!) in
                print("DELETE TEST")
                print(indexPath.row)
                //self.tableView.isEditing = true
                self.removeExpPoint(index: "\(self.sections[indexPath.row].index)")
                self.sections.remove(at: indexPath.row)
                self.tableView.reloadData()
            }))
            
            refreshAlert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { (action: UIAlertAction!) in
                print("Handle Cancel Logic here")
            }))
            
            self.present(refreshAlert, animated: true, completion: nil)
            
            
        })
        
        delete.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        
        let more = UITableViewRowAction(style: UITableViewRowActionStyle.default, title: "\u{2714}\n Mark Visited" , handler: { (action:UITableViewRowAction!, indexPath:IndexPath!) -> Void in
            //Do something
            print("Mark as Visited TEST")
            print(indexPath.row)
        })
        more.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        
        //more.backgroundColor = UIColor(patternImage: UIImage(named: "up")!)
        
       /* let move = UITableViewRowAction(style: UITableViewRowActionStyle.default, title: "\nMove" , handler: { (action:UITableViewRowAction!, indexPath:IndexPath!) -> Void in
            //Do something
            print("Mark as Visited TEST")
            print(indexPath.row)
        })
        let img: UIImage = UIImage(named: "up")!
        let imgSize: CGSize = tableView.frame.size
        UIGraphicsBeginImageContext(imgSize)
        img.draw(in: CGRect(x: 20, y: 0, width: 20, height: 20))
        let newImage: UIImage = UIGraphicsGetImageFromCurrentImageContext()!
        UIGraphicsEndImageContext()
        
        move.backgroundColor = UIColor(patternImage: newImage)*/
        
        return [delete, more/*, move*/]
    }
    
    func getDataFromUrl(url: URL, completion: @escaping (_ data: Data?, _  response: URLResponse?, _ error: Error?) -> Void) {
        URLSession.shared.dataTask(with: url) {
            (data, response, error) in
            completion(data, response, error)
            }.resume()
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 105.0
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        let verify = checkIfAdded(index: "\(sections[indexPath.row].index)")
        if verify == true {
            removeAdded(index: "\(indexPath.row + 1)")
            tableView.reloadData()
        }else{
            let count = getSelected()
            if count >= 2 {
                Toast(text: "You have already selected two points to navigate").show()
            }else if count < 2{
                addNavigationPoint(index: "\(sections[indexPath.row].index)")
                tableView.reloadData()
            }else{
                print("count is exact \(count)")
            }
        }
        
    }

}
