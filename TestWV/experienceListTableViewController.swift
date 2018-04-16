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
    var position:String
}

struct SectionsVisted{
    var name:String
    var location:String
    var distance:String
    var status:String
    var image:String
    var lattitude:String
    var longitude:String
    var description:String
    var index:String
    var position:String
}

class experienceListTableViewController: UITableViewController, NVActivityIndicatorViewable, CLLocationManagerDelegate {

    var URL = "http://34.231.31.72/xplore/index.php"
    var sections:[Sections] = []
    var sectionsVisited:[SectionsVisted] = []
    private var dragView: UIView?
    @IBOutlet weak var dropZone: UIView!
    
    var dbQueue: DatabaseQueue!
    var visitedClicked = false
    
    
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
        
        self.tableView.isEditing = true
        tableView.allowsSelectionDuringEditing = true
        //self.navigationItem.rightBarButtonItem = self.editButtonItem
        
    }
    
   
    
    public func getSections(){
        do {
            var sec = [String]()
            try dbQueue.inDatabase { db in
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM showSelected where id = 1")
                
                while let row = try rows.next() {
                    let sectionName: String = row.value(named: "isSelected")
                    sec.append(sectionName)
                }
            }
            if sec.count > 0{
                if sec[0] == "1" {
                    //show visited
                    visitedClicked = true
                }else{
                    //show not visited
                    visitedClicked = false
                }
            }else{
                visitedClicked = false
                //show not visited
            }
            
            var elCount:Int
            elCount = 0
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM experience")! // Int
                
                print("Count : \(elCount)")
                
            }
            
            var i = 0
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM experience order by position ASC")
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
                        let visited: String = row.value(named: "visited")
                        var position: String = row.value(named: "position")
                        print("Position is")
                       print(position)

                        if visited != nil && visited == "1"{
                            self.sectionsVisited.append(SectionsVisted(name: name, location: location, distance: distance, status: status, image : image,lattitude:lattitude, longitude:longitude,description:description,index:index, position: String(i)))
                            
                            //let val = updatePosition(name: name, address: location, position: i)
                            //print(val)
                        }else{
                            self.sections.append(Sections(name: name, location: location, distance: distance, status: status, image : image,lattitude:lattitude, longitude:longitude,description:description,index:index, position: String(i)))
                            
                            //let val = updatePosition(name: name, address: location, position: i)
                            //print(val)
                        }
                        
                    }
                    
                }
                i = i+1
            }
            
            print(sections)
            
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
    
    func markVisitedExpPoint(index:String){
        do {
            var sec = [String]()
            try dbQueue.inDatabase { db in
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM experience where uniqueId = ?", arguments:[index])
                
                while let row = try rows.next() {
                    let sectionName: String = row.value(named: "visited")
                    sec.append(sectionName)
                }
            }
            if sec.count > 0{
                if sec[0] == "0" || sec[0] == "" {
                    try dbQueue.inDatabase { db in
                        try db.execute(
                            "update experience set visited = '1' where uniqueId = ?",
                            arguments: [index])
                    }
                }else{
                    try dbQueue.inDatabase { db in
                        try db.execute(
                            "update experience set visited = '0' where uniqueId = ?",
                            arguments: [index])
                    }
                }
            }else{
                try dbQueue.inDatabase { db in
                    try db.execute(
                        "update experience set visited = '1' where uniqueId = ?",
                        arguments: [index])
                }
            }
        } catch {
            print(error.localizedDescription)
        }
    }
    
    func updatePosition(name:String, address:String, position:Int) -> Bool{
        do {
            var sec = [String]()
            try dbQueue.inDatabase { db in
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM experience where name = ? and location = ?", arguments:[name, address])
                
                while let row = try rows.next() {
                    let sectionName: String = row.value(named: "visited")
                    sec.append(sectionName)
                }
            }
            if sec.count > 0{
                try dbQueue.inDatabase { db -> Bool in
                    try db.execute(
                            "update experience set position = '?' where name = ? and location = ?",
                            arguments: [position, name, address])
                    return true
                }
                
            }else{
                return false
            }
        } catch {
            print(error.localizedDescription)
            return false
        }
        return true
    }
    
    func updateIndex(index:String,destIndex:String, source:Int, dest:Int){
        do {
            
            try dbQueue.inDatabase { db in
                /*try db.execute(
                    "update experience set position = '-1' where position ='0'" )*/
                try db.execute(
                        "update experience set position = ? where uniqueId = ?",
                        arguments: [dest,index])
                try db.execute(
                    "update experience set position = ? where uniqueId = ?",
                    arguments: [source,destIndex])
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
        // Check which list to return accordingly check and return its count
        print("number of rows")
        if visitedClicked == true{
            print(sectionsVisited.count)
            return sectionsVisited.count
        }else{
            print(sections.count)
            return sections.count
        }
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        print("Sections rows cell formation")
        let cell = Bundle.main.loadNibNamed("ShowListSubSectionsTableViewCell", owner: self, options: nil)?.first as! ShowListSubSectionsTableViewCell
        
        //cell.backgroundColor = UIColor.black
        if visitedClicked == true{
            print("visited Cells")
            if (sectionsVisited.count>0){
                let imageUrl = NSURL(string: "https://s3.amazonaws.com/retail-safari/resize_image/"+sectionsVisited[indexPath.row].image)! as URL
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
                let verify = checkIfAdded(index: "\(sectionsVisited[indexPath.row].index)")
                if verify == true {
                    cell.rightImage.image = UIImage(named: "tick-list")
                }else{
                    cell.rightImage.image = nil
                }
                
                cell.titleLabel.text = sectionsVisited[indexPath.row].name
                cell.locationLabel.text = sectionsVisited[indexPath.row].location
                cell.distanceLabel.text = sectionsVisited[indexPath.row].distance
                cell.statusLabel.text = sectionsVisited[indexPath.row].status
                cell.leftImage.layer.cornerRadius = 10.0
                cell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
            }else{
                print("No data available")
            }
            
        }else{
            print("not visited cells")
            if(sections.count > 0){
                let imageUrl = NSURL(string: "https://s3.amazonaws.com/retail-safari/resize_image/"+sections[indexPath.row].image)! as URL
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
            }else{
                print("No data available")
            }
            
        }
        
        
        /*let lpGestureRecognizer: UILongPressGestureRecognizer = UILongPressGestureRecognizer(target: self, action: #selector(didLongPressCell))
        cell.contentView.addGestureRecognizer(lpGestureRecognizer)*/
        
        return cell

    }
    
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        return true
    }
    
    override func tableView(_ tableView: UITableView, editingStyleForRowAt indexPath: IndexPath) -> UITableViewCellEditingStyle {
        if self.tableView.isEditing == true{
            return .delete
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
        
        //if(destinationIndexPath.row == 0){
        updateIndex(index: sections[sourceIndexPath.row].index,destIndex: sections[destinationIndexPath.row].index, source:sourceIndexPath.row, dest:destinationIndexPath.row)
        //}
    
        if(sourceIndexPath.row != destinationIndexPath.row){
            swap(&sections[sourceIndexPath.row], &sections[destinationIndexPath.row])

        }
        
        
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
        if visitedClicked == true{
            let delete = UITableViewRowAction(style: UITableViewRowActionStyle.default, title: "\u{274C}\n Delete" , handler: { (action:UITableViewRowAction!, indexPath:IndexPath!) -> Void in
                //Do something
                let refreshAlert = UIAlertController(title: "Delete", message: "Are you sure you want to remove this place from experience?", preferredStyle: UIAlertControllerStyle.alert)
                
                refreshAlert.addAction(UIAlertAction(title: "Delete", style: .default, handler: { (action: UIAlertAction!) in
                    print("DELETE TEST")
                    print(indexPath.row)
                    //self.tableView.isEditing = true
                    if self.visitedClicked == true{
                        self.removeExpPoint(index: "\(self.sectionsVisited[indexPath.row].index)")
                        self.sectionsVisited.remove(at: indexPath.row)
                        self.tableView.reloadData()
                    }else{
                        self.removeExpPoint(index: "\(self.sections[indexPath.row].index)")
                        self.sections.remove(at: indexPath.row)
                        self.tableView.reloadData()
                    }
                    
                }))
                
                refreshAlert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { (action: UIAlertAction!) in
                    print("Handle Cancel Logic here")
                }))
                
                self.present(refreshAlert, animated: true, completion: nil)
                
                
            })
            
            delete.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
            
            let more = UITableViewRowAction(style: UITableViewRowActionStyle.default, title: "\u{2714}\n Mark As \nNot Visited" , handler: { (action:UITableViewRowAction!, indexPath:IndexPath!) -> Void in
                //Do something
                print("Mark as Visited TEST")
                print(indexPath.row)
                if self.visitedClicked == true{
                    self.markVisitedExpPoint(index: "\(self.sectionsVisited[indexPath.row].index)")
                    self.sectionsVisited.remove(at: indexPath.row)
                    self.tableView.reloadData()
                }else{
                    self.markVisitedExpPoint(index: "\(self.sections[indexPath.row].index)")
                    self.sections.remove(at: indexPath.row)
                    self.tableView.reloadData()
                }
                
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
        }else{
            let delete = UITableViewRowAction(style: UITableViewRowActionStyle.default, title: "\u{274C}\n Delete" , handler: { (action:UITableViewRowAction!, indexPath:IndexPath!) -> Void in
                //Do something
                let refreshAlert = UIAlertController(title: "Delete", message: "Are you sure you want to remove this place from experience?", preferredStyle: UIAlertControllerStyle.alert)
                
                refreshAlert.addAction(UIAlertAction(title: "Delete", style: .default, handler: { (action: UIAlertAction!) in
                    print("DELETE TEST")
                    print(indexPath.row)
                    //self.tableView.isEditing = true
                    if self.visitedClicked == true{
                        self.removeExpPoint(index: "\(self.sectionsVisited[indexPath.row].index)")
                        self.sectionsVisited.remove(at: indexPath.row)
                        self.tableView.reloadData()
                    }else{
                        self.removeExpPoint(index: "\(self.sections[indexPath.row].index)")
                        self.sections.remove(at: indexPath.row)
                        self.tableView.reloadData()
                    }
                    
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
                if self.visitedClicked == true{
                    self.markVisitedExpPoint(index: "\(self.sectionsVisited[indexPath.row].index)")
                    self.sectionsVisited.remove(at: indexPath.row)
                    self.tableView.reloadData()
                }else{
                    self.markVisitedExpPoint(index: "\(self.sections[indexPath.row].index)")
                    self.sections.remove(at: indexPath.row)
                    self.tableView.reloadData()
                }
                
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
    
    func tableView(tableView: UITableView, shouldIndentWhileEditingRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        return false
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
        NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
        var newURL = ""
        if visitedClicked == true{
            newURL = "/site/getPlaceProfileNative?SrNumber="+String(sectionsVisited[indexPath.row].index)
        }else{
            newURL = "/site/getPlaceProfileNative?SrNumber="+String(sections[indexPath.row].index)
        }
        
        Alamofire.request(self.URL + newURL).responseString { response in
            print("Request: \(String(describing: response.request))")   // original url request
            print("Response: \(String(describing: response.response))") // http url response
            print("Result: \(response.result)")
            // response serialization result
            
            if let json = response.data {
                let data = JSON(data: json)
                print(data)
                let coords = data["LatLng"]
                
                print(coords)
                print(coords["H"])
                print(coords["L"])
                
                let id : Int = data["SrNumber"].intValue
                let title : String = data["Detail"]["name"].stringValue
                let address : String = data["Detail"]["address"].stringValue
                let distance : String = ""
                let website : String = data["Detail"]["Website"].stringValue
                let latitude : String = coords["H"].stringValue
                let longitude : String = coords["L"].stringValue
                let description : String = data["Detail"]["about"].stringValue
                let image : String = data["Detail"]["Path"].stringValue
                let phone : String = data["Detail"]["Phone"].stringValue
                let foursquareRating : String = "4.5"
                let yelpRating : String = "4.2"
                let quality : String = "4"
                let totalReviews : String = "24"
                let avgRating : String = "4.1"
                
                print("Image \(image)")
                
                self.savePlaceProfile(Index: id, title: title, address: address, distance: distance, website: website, lattitude: latitude, longitude: longitude, description: description, image: image, phone: phone, foursquareRating: foursquareRating, yelpRating: yelpRating, quality: quality, totalReviews: totalReviews, avgRating: avgRating)
            }

        }
        
        
    }
    
    public func savePlaceProfile(Index:Int, title:String, address:String, distance:String, website:String, lattitude:String, longitude:String, description:String, image:String, phone:String, foursquareRating:String, yelpRating:String, quality:String, totalReviews:String, avgRating:String){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                try db.execute(
                    "delete from placeProfile")
                
                try db.execute(
                    "INSERT INTO placeProfile (uniqueID, name, address, distance, website, lattitude, longitude, description, image, phone, foursquareRating, yelpRating, quality, totalReviews, avgRating) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    arguments: [Index, title, address, distance, website, lattitude, longitude, description, image, phone, foursquareRating, yelpRating, quality, totalReviews, avgRating])
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM placeProfile")
                while let row = try rows.next() {
                    let sectionIndex: String = row.value(named: "uniqueID")
                    //print(sectionIndex)
                }
                NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
                
                let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                let newViewController = storyBoard.instantiateViewController(withIdentifier: "placeProfile")
                self.present(newViewController, animated: true, completion: nil)
                
                let elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM placeProfile")! // Int
                let elSectionNames = try String.fetchAll(db, "SELECT uniqueID FROM placeProfile")
                //print("Count : \(elCount)")
            }
        } catch {
            print(error.localizedDescription)
        }
        
    }


}
