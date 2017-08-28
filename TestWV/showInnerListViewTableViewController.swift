//
//  showInnerListViewTableViewController.swift
//  TestWV
//
//  Created by earth on 17/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB
import NVActivityIndicatorView
import Alamofire
import SwiftyJSON
import CoreLocation

class showInnerListViewTableViewController: UITableViewController,NVActivityIndicatorViewable, CLLocationManagerDelegate {

    var dbQueue: DatabaseQueue!
    struct SubSections{
        var title:String
        var location:String
        var distance:String
        var status:String
        var image:String
        var uniqueID:Int
        var lat:Double
        var long:Double
    }
    
    
    var sec_URL = String()
    var sections = [String]()
    var subsections:[SubSections] = []
    var positionArray = [Int]()
    var countArray = [Int]()
    var cell1Array = [Int]()
    var cell2Array = [Int]()
    var selectedArray = [Int]()
    var imageArray = [UIImage]()
    
    let locManager = CLLocationManager()
    var locationManager = CLLocationManager()
    var latCenter:Double? = nil
    var longCenter:Double? = nil
    
    @IBOutlet weak var backBtn: UIBarButtonItem!
    var URL = "http://34.231.31.72/xplore/index.php"
    
    @IBAction func backBtnClicked(_ sender: UIBarButtonItem) {
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "nativeListViewController")
        self.present(newViewController, animated: true, completion: nil)
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let userLocation:CLLocation = locations[0] as CLLocation
        
        // Call stopUpdatingLocation() to stop listening for location updates,
        // other wise this function will be called every time when user location changes.
        
        // manager.stopUpdatingLocation()
        
       // print("user latitude = \(userLocation.coordinate.latitude)")
       // print("user longitude = \(userLocation.coordinate.longitude)")
        
        latCenter = userLocation.coordinate.latitude
        longCenter = userLocation.coordinate.longitude
        
     //   print(latCenter)
      //  print(longCenter)
        
    }
    
    func locationManager(manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let locValue:CLLocationCoordinate2D = manager.location!.coordinate
        print("locations = \(locValue.latitude) \(locValue.longitude)")
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error)
    {
        print("Error \(error)")
    }
    
    func setUpDatabasePath()
    {
        let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first! as NSString
        let databasePath = documentsPath.appendingPathComponent("sqliteDB.sqlite")
        //print("DATABASE PATH !!!!")
        //print(databasePath)
        let fileManager:FileManager = FileManager.default
        var success = fileManager.fileExists(atPath: databasePath)
        if (success)
        {
            dbQueue = try! DatabaseQueue(path: databasePath)
            //print("writing to documents directory")
            //print(databasePath)
            //break
            return
        }
        if (!success)
        {
            let bundlePath = Bundle.main.path(forResource: "sqliteDB", ofType: "sqlite")
            success = fileManager.fileExists(atPath: bundlePath!)
            //print("writing from app bundle")
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
    
    public func deleteFromDB(){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                
                try db.execute(
                    "delete from selectList")
                
            }
        } catch {
            print(error.localizedDescription)
        }
        
    }
    
    public func getSections(){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            var elCount:Int
            elCount = 0
            var i = -1;
            
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM selectList")! // Int
                
                //print("Count : \(elCount)")
                
            }
            
            
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM selectList")
                    while let row = try rows.next() {
                        let sectionName: String = row.value(named: "sectionName")
                        
                        let sectionURL: String = row.value(named: "sectionURL")
                        self.sec_URL = sectionURL
                        self.backBtn.title = "< "+sectionName
                    }
                    
                }
            }
            
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM selectedPlaces")! // Int
                
                //print("Count : \(elCount)")
                
            }
            
            
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM selectedPlaces")
                    while let row = try rows.next() {
                        let uniqueID : String = row.value(named: "uniqueID")
                        
                        selectedArray.append(Int(uniqueID)!)
                        print(selectedArray)
                    }
                    
                }
            }
            
            let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
            NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
            Alamofire.request(self.sec_URL).responseString { response in
                print("Request: \(String(describing: response.request))")   // original url request
                print("Response: \(String(describing: response.response))") // http url response
                print("Result: \(response.result)")                         // response serialization result
                
                if let json = response.data {
                    let data = JSON(data: json)
                    self.countArray.append(data.count)
                    
                    if(data.count > 0){
                        for k in 0..<data.count{
                            i = i+1
                            self.positionArray.append(2)
                            self.cell2Array.append(i)
                            let id : Int = data[k]["SrNumber"].intValue
                            let coordinates = data[k]["LatLng"]
                            let latt : Double = coordinates["H"].doubleValue
                            let longg : Double = coordinates["L"].doubleValue
                            let coordinate₀ = CLLocation(latitude: latt, longitude: longg)
                            let coordinate₁ = CLLocation(latitude: self.latCenter!, longitude: self.longCenter!)
                            
                            let distanceInMeters = coordinate₀.distance(from: coordinate₁) // result is in meters
                            let distInMiles = distanceInMeters / 1609
                            var dist:String = String(format:"%.2f mi away", distInMiles)
                            
                            //print(id)
                            //print(coordinates)
                            //print(latt)
                            //print(longg)
                            let json1 = data[k]["Detail"]
                            //print("data \(json1["name"])")
                            //self.positionArray.insert(2, at: indexPath.row+1)
                            self.subsections.append(SubSections(title: json1["name"].string!, location: json1["address"].string!, distance: dist, status: "OPEN", image : json1["profileimage"].string!, uniqueID : id, lat : latt, long : longg))
                            /*if k == (data.count-1){
                                print(k)
                                self.downloadAllImages()
                            }*/
                            
                        }
                        
                    }
                    //let data1 = JSON(String: json1)
                    //print("data1 \(data1)")
                }
                NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
                self.tableView.reloadData()
            }
            
        } catch {
            print(error.localizedDescription)
        }
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if CLLocationManager.locationServicesEnabled() {
            locationManager.delegate = self as? CLLocationManagerDelegate
            locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
            locationManager.startUpdatingLocation()
        }
        
        locManager.delegate = self
        locManager.desiredAccuracy = kCLLocationAccuracyBest
        locManager.requestWhenInUseAuthorization()
        locManager.startMonitoringSignificantLocationChanges()
        setUpDatabasePath()
        getSections()
        //downloadAllImages()
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
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
        return self.subsections.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = Bundle.main.loadNibNamed("ShowListSubSectionsTableViewCell", owner: self, options: nil)?.first as! ShowListSubSectionsTableViewCell
        
        cell.backgroundColor = UIColor.black
        
        if selectedArray.contains(subsections[indexPath.row].uniqueID) {
            cell.rightImage.image = UIImage(named:"tick-list")
        }else{
            cell.rightImage.image = UIImage(named:"add")
        }
        cell.rightImage.isUserInteractionEnabled = true
        cell.rightImage.tag = subsections[indexPath.row].uniqueID
        
        
        let trimmedString = subsections[indexPath.row].image.replacingOccurrences(of: " ", with: "%20")
        let img = "https://s3.amazonaws.com/retail-safari/resize_image/" + trimmedString
        print(img)
        let imageUrl = NSURL(string: img)! as URL
        print("Download Started")
        print(imageUrl);
        getDataFromUrl(url: imageUrl) { (data, response, error)  in
            guard let data = data, error == nil else { return }
            print(response?.suggestedFilename ?? imageUrl.lastPathComponent)
            print("Download Finished")
            DispatchQueue.main.async() { () -> Void in
                
                if(UIImage(data:data) != nil){
                    cell.leftImage.image = UIImage(data: data)
                    cell.leftImage.contentMode = .scaleAspectFit
                }else{
                    self.imageArray.append(UIImage(named: "nature")!)
                    cell.leftImage.contentMode = .scaleAspectFit
                }
            }
        }
        print("End of code. The image will continue downloading in the background and it will be loaded when it ends.")
        
        
        
        var tapped:UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(TappedOnImage(_recognizer:)))
        tapped.numberOfTapsRequired = 1
        cell.rightImage.addGestureRecognizer(tapped)

        cell.titleLabel.text = subsections[indexPath.row].title
        cell.locationLabel.text = subsections[indexPath.row].location
        cell.distanceLabel.text = subsections[indexPath.row].distance
        cell.statusLabel.text = subsections[indexPath.row].status
        cell.leftImage.layer.cornerRadius = 10.0
        cell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        return cell
    }
    
    /*func downloadAllImages(){
        print(subsections.count)
        for i in 0..<subsections.count{
            print(i)
            print(subsections[i].image)
            let trimmedString = subsections[i].image.replacingOccurrences(of: " ", with: "%20")
            let img = "https://s3.amazonaws.com/retail-safari/" + trimmedString
            print(img)
            let imageUrl = NSURL(string: img)! as URL
            print("Download Started")
            print(imageUrl);
            getDataFromUrl(url: imageUrl) { (data, response, error)  in
                guard let data = data, error == nil else { return }
                print(response?.suggestedFilename ?? imageUrl.lastPathComponent)
                print("Download Finished")
                DispatchQueue.main.async() { () -> Void in
                   
                    if(UIImage(data:data) != nil){
                        self.imageArray.append(UIImage(data: data)!)
                    }else{
                        self.imageArray.append(UIImage(named: "nature")!)
                    }
                    self.tableView.reloadData()
                    print(i)
                }
            }
            print("End of code. The image will continue downloading in the background and it will be loaded when it ends.")
        }
        
        
    }*/
    
    func TappedOnImage(_recognizer:UITapGestureRecognizer){
        
        //using sender, we can get the point in respect to the table view
        let tapLocation = _recognizer.location(in: self.tableView)
        
        //using the tapLocation, we retrieve the corresponding indexPath
        let indexPath = self.tableView.indexPathForRow(at: tapLocation)
        
        //finally, we print out the value
        print(indexPath?.row as Any)
        
        //we could even get the cell from the index, too
        //let cell = self.tableView.cellForRow(at: indexPath!)
        //cell.textLabel?.text = "Hello, Cell!"
        
        let optionalString = _recognizer.view?.tag
        
        // now unwrap it
        if let unwrapped = optionalString {
            print(unwrapped)
            if selectedArray.contains(unwrapped){
                if let index = selectedArray.index(of:unwrapped) {
                    selectedArray.remove(at: index)
                    removeFromDB(Index: unwrapped)
                    let uniqueId = subsections[(indexPath?.row)!].uniqueID
                    removeFromExp(index: uniqueId)
                    
                }
            }else{
                addToDB(Index: unwrapped)
                selectedArray.append(unwrapped)
                let title = subsections[(indexPath?.row)!].title
                let location = subsections[(indexPath?.row)!].location
                let lat = subsections[(indexPath?.row)!].lat
                let long = subsections[(indexPath?.row)!].long
                let image = subsections[(indexPath?.row)!].image
                let uniqueId = subsections[(indexPath?.row)!].uniqueID
                addToExp(Name: title, Location: location, lat: lat, long: long, image: image, index: uniqueId)
            }
            
        }
        print(selectedArray)
        tableView.reloadData()
    }
    
    public func addToExp(Name:String, Location:String, lat:Double, long:Double, image:String, index:Int){
        do {
            try dbQueue.inDatabase { db in
                try db.execute(
                    "INSERT INTO experience (name, location, distance, status, lattitude, longitude, description, image, selected, uniqueId) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    arguments: [Name, Location, "1 mi away", "OPEN", String(describing: lat),String(describing: long),"Test Desc",image,"0", index])
                print(index)
            }
        } catch {
            print(error.localizedDescription)
        }
    }
    
    public func removeFromExp(index:Int){
        do {
            try dbQueue.inDatabase { db in
                try db.execute(
                    "delete from experience where uniqueID = ?",
                    arguments: [index])
            }
        } catch {
            print(error.localizedDescription)
        }
    }

    
    public func addToDB(Index:Int){
        do {
            try dbQueue.inDatabase { db in
                try db.execute(
                    "INSERT INTO selectedPlaces (uniqueID) " +
                    "VALUES (?)",
                    arguments: [Index])
            }
        } catch {
            print(error.localizedDescription)
        }
        
    }
    
    public func removeFromDB(Index:Int){
        
        do {
            try dbQueue.inDatabase { db in
                try db.execute(
                    "delete from selectedPlaces where uniqueID = ?",
                    arguments: [Index])
            }
        } catch {
            print(error.localizedDescription)
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
                
                let elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM placeProfile")! // Int
                let elSectionNames = try String.fetchAll(db, "SELECT uniqueID FROM placeProfile")
                //print("Count : \(elCount)")
            }
        } catch {
            print(error.localizedDescription)
        }
        
    }

    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
        NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
        let newURL = "/site/getPlaceProfileNative?SrNumber="+String(subsections[indexPath.row].uniqueID)
        Alamofire.request(self.URL + newURL).responseString { response in
            print("Request: \(String(describing: response.request))")   // original url request
            print("Response: \(String(describing: response.response))") // http url response
            print("Result: \(response.result)")
            // response serialization result
            
            if let json = response.data {
                let data = JSON(data: json)
                print(data)
                let id : Int = data["SrNumber"].intValue
                let title : String = data["Detail"]["name"].stringValue
                let address : String = data["Detail"]["address"].stringValue
                let distance : String = ""
                let website : String = data["Detail"]["Website"].stringValue
                let latitude : String = data["Detail"]["Website"].stringValue
                let longitude : String = data["Detail"]["Website"].stringValue
                let description : String = data["Detail"]["about"].stringValue
                let image : String = data["Detail"]["profileimage"].stringValue
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
        
        
        
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "placeProfile")
        self.present(newViewController, animated: true, completion: nil)
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


}
