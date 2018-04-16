//
//  listenListTableViewController.swift
//  TestWV
//
//  Created by earth on 26/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import GRDB
import NVActivityIndicatorView
import MapboxGeocoder
import SearchTextField
import RZTransitions
import CoreLocation

class listenListTableViewController: UITableViewController, CLLocationManagerDelegate {

    @IBOutlet var outdoorsImage: UIImageView!
    @IBOutlet var concertsImage: UIImageView!
    @IBOutlet var jazzImage: UIImageView!
    @IBOutlet var smallVenueImage: UIImageView!
    @IBOutlet var testStoreImage: UIImageView!
    
    
    @IBAction func backBtnClicked(_ sender: UIBarButtonItem) {
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "nativeDiscoverController")
        self.present(newViewController, animated: false, completion: nil)
    }
    
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
        self.tableView.backgroundColor = UIColor.black
        
        if selectAtIndex(Index: "0"){
            outdoorsImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "1"){
            concertsImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "2"){
            jazzImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "3"){
            smallVenueImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "4"){
            testStoreImage.image = UIImage(named: "tick-list")
        }
        
        changeLocationBtn.layer.cornerRadius = 20
        changeLocationBtn.layer.borderWidth = 1
        changeLocationBtn.layer.borderColor = UIColor.gray.cgColor
        
        setupDistanceBtn.layer.cornerRadius = 20
        setupDistanceBtn.layer.borderWidth = 1
        setupDistanceBtn.layer.borderColor = UIColor.gray.cgColor
        
        locationTF.addTarget(self, action: "TFDidChange", for: UIControlEvents.editingChanged)
        
        locManager.delegate = self
        locManager.desiredAccuracy = kCLLocationAccuracyBest
        locManager.requestWhenInUseAuthorization()
        locManager.startMonitoringSignificantLocationChanges()
        
        //topBtnCell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        SetupDistanceCell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        ChangeLocationCell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        
        locationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestAlwaysAuthorization()
        
        if CLLocationManager.locationServicesEnabled() {
            locationManager.startUpdatingLocation()
            //locationManager.startUpdatingHeading()
        }
        
        

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
        return 9
    }
    
    public func selectAtIndex(Index:String) -> Bool{
        
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            var elCount:Int
            elCount = 0
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM listenList where sectioIndex = ?", arguments:[Index])! // Int
                
                print("Count : \(elCount)")
                
            }
            if elCount == 1{
                return true
            }else{
                return false
            }
            
        } catch {
            print(error.localizedDescription)
            return false
        }
    }
    
    public func addToDB(Name:String, Index:String){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                try db.execute(
                    "INSERT INTO listenList (sectionName, sectioIndex) " +
                    "VALUES (?, ?)",
                    arguments: [Name, Index])
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM listenList")
                while let row = try rows.next() {
                    let sectionName: String = row.value(named: "sectionName")
                    let sectionIndex: String = row.value(named: "sectioIndex")
                    print(sectionName)
                    print(sectionIndex)
                }
                
                let elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM listenList")! // Int
                let elSectionNames = try String.fetchAll(db, "SELECT sectionName FROM listenList")
                print("Count : \(elCount)")
                print(elSectionNames[0])
            }
        } catch {
            print(error.localizedDescription)
        }
        
    }
    
    public func removeFromDB(Index:String){
        
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                try db.execute(
                    "delete from listenList where sectioIndex = ?",
                    arguments: [Index])
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM listenList")
                while let row = try rows.next() {
                    let sectionName: String = row.value(named: "sectionName")
                    let sectionIndex: String = row.value(named: "sectioIndex")
                    print(sectionName)
                    print(sectionIndex)
                }
                
                let elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM listenList")! // Int
                let elSectionNames = try String.fetchAll(db, "SELECT sectionName FROM listenList")
                print("Count : \(elCount)")
                print(elSectionNames.count)
            }
        } catch {
            print(error.localizedDescription)
        }
        
    }

    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if indexPath.row == 4 {
            if outdoorsImage.image == nil{
                outdoorsImage.image = UIImage(named: "tick-list")
                outdoorsImage.contentMode = .center
                addToDB(Name: "OUTDOORS", Index: "0")
            }else{
                outdoorsImage.image = nil
                removeFromDB(Index: "0")
            }
        }
        if indexPath.row == 5 {
            if concertsImage.image == nil{
                concertsImage.image = UIImage(named: "tick-list")
                concertsImage.contentMode = .center
                addToDB(Name: "CONCERTS", Index: "1")
            }else{
                concertsImage.image = nil
                removeFromDB(Index: "1")
            }
        }
        if indexPath.row == 6 {
            if jazzImage.image == nil{
                jazzImage.image = UIImage(named: "tick-list")
                jazzImage.contentMode = .center
                addToDB(Name: "JAZZ", Index: "2")
            }else{
                jazzImage.image = nil
                removeFromDB(Index: "2")
            }
        }
        if indexPath.row == 7 {
            if smallVenueImage.image == nil{
                smallVenueImage.image = UIImage(named: "tick-list")
                smallVenueImage.contentMode = .center
                addToDB(Name: "Small Venue", Index: "3")
            }else{
                smallVenueImage.image = nil
                removeFromDB(Index: "3")
            }
        }
        if indexPath.row == 8 {
            if testStoreImage.image == nil{
                testStoreImage.image = UIImage(named: "tick-list")
                testStoreImage.contentMode = .center
                addToDB(Name: "Test Store", Index: "4")
            }else{
                testStoreImage.image = nil
                removeFromDB(Index: "4")
            }
        }
        
        tableView.deselectRow(at: indexPath, animated: true)
    }

    var selectDistanceVisible = false
    var changeLocationVisible = false
    
    @IBOutlet weak var topBtnCell: UITableViewCell!
    @IBOutlet weak var setupDistanceBtn: UIButton!
    @IBOutlet weak var changeLocationBtn: UIButton!
    @IBOutlet weak var iAmHereLabel: UILabel!
    @IBOutlet weak var ChangeLocationCell: UITableViewCell!
    @IBOutlet weak var SetupDistanceCell: UITableViewCell!
    @IBOutlet weak var locationTFNew: SearchTextField!
    
    @IBOutlet weak var sliderValLabel: UILabel!
    
    @IBOutlet weak var locationTF: SearchTextField!
    var suggestions = [String]()
    let locManager = CLLocationManager()
    var locationManager = CLLocationManager()
    
    @IBOutlet weak var silderView: UISlider!
    var latCenter:Double? = nil
    var longCenter:Double? = nil
    
    @IBAction func sliderValChanged(_ sender: UISlider) {
        let sliderVal = NSString(format: "%.2f mi", sender.value)
        sliderValLabel.text = sliderVal as String
        
        
    }
    
    func TFDidChange(){
        print("Edit Started")
        let geocoder = Geocoder(accessToken: "pk.eyJ1IjoiYXl1c2hnZWhhbG90IiwiYSI6ImNpbDUwbmlhcTQ3dWh2eW0zaXN1cTExZjgifQ.RXW6tJJo4F2MSY-qoDRmFg")
        
        if (locationTF.text?.characters.count)! > 0{
            iAmHereLabel.text = locationTF.text
            
            let options = ForwardGeocodeOptions(query: locationTF.text!)
            
            // To refine the search, you can set various properties on the options object.
            //options.allowedISOCountryCodes = ["CA"]
            //options.focalLocation = CLLocation(latitude: 45.3, longitude: -66.1)
            options.allowedScopes = [.address, .pointOfInterest]
            
            let task = geocoder.geocode(options) { (placemarks, attribution, error) in
                if(placemarks != nil){
                    self.suggestions.removeAll()
                    for i in 0..<Int((placemarks?.count)!){
                        guard let placemark = placemarks?[i] else {
                            return
                        }
                        let coordinate = placemark.location.coordinate
                        //print(placemark.name)
                        // 200 Queen St
                        print(placemark.qualifiedName)
                        self.suggestions.append(placemark.qualifiedName)
                    }
                    
                    
                    self.locationTFNew.filterStrings(self.suggestions)
                    // 200 Queen St, Saint John, New Brunswick E2L 2X1, Canada
                    self.locationTF.maxNumberOfResults = 5
                    self.locationTF.itemSelectionHandler = { filteredResults, itemPosition in
                        // Just in case you need the item position
                        //print(self.items)
                        
                        let item = filteredResults[itemPosition]
                        print("Item at position \(itemPosition): \(item.title)")
                        self.locationTF.text = item.title.uppercased()
                        self.iAmHereLabel.text = item.title.uppercased()
                        GlobalLocation.location = item.title.uppercased()
                    }
                    
                    
                    #if !os(tvOS)
                        let formatter = CNPostalAddressFormatter()
                        //print(formatter.string(from: placemark.postalAddress!))
                        // 200 Queen St
                        // Saint John New Brunswick E2L 2X1
                        // Canada
                    #endif
                }
                
            }
            
        }else{
            iAmHereLabel.text = "I am here..."
        }
        
        print(suggestions)
    }
    
    func defaultLocation(){
        let geocoder = Geocoder(accessToken: "pk.eyJ1IjoiYXl1c2hnZWhhbG90IiwiYSI6ImNpbDUwbmlhcTQ3dWh2eW0zaXN1cTExZjgifQ.RXW6tJJo4F2MSY-qoDRmFg")
        let options = ReverseGeocodeOptions(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(latCenter!), longitude: CLLocationDegrees(longCenter!)))
        // Or perhaps: ReverseGeocodeOptions(location: locationManager.location)
        
        let task = geocoder.geocode(options) { (placemarks, attribution, error) in
            guard let placemark = placemarks?.first else {
                return
            }
            
            //print(placemark.imageName ?? "")
            // telephone
            //print(placemark.genres?.joined(separator: ", ") ?? "")
            // computer, electronic
            //print(placemark.administrativeRegion?.name ?? "")
            // New York
            //print(placemark.administrativeRegion?.code ?? "")
            // US-NY
            //print(placemark.place?.wikidataItemIdentifier ?? "")
            // Q60
            //print(placemark.qualifiedName)
            if(GlobalLocation.location == ""){
                GlobalLocation.location = placemark.qualifiedName.uppercased()
            }
            self.iAmHereLabel.text = GlobalLocation.location.uppercased()
        }
    }
    
    func determineMyCurrentLocation() {
        locationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestAlwaysAuthorization()
        
        if CLLocationManager.locationServicesEnabled() {
            locationManager.startUpdatingLocation()
            //locationManager.startUpdatingHeading()
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let userLocation:CLLocation = locations[0] as CLLocation
        
        // Call stopUpdatingLocation() to stop listening for location updates,
        // other wise this function will be called every time when user location changes.
        
        // manager.stopUpdatingLocation()
        
        //print("user latitude = \(userLocation.coordinate.latitude)")
        //print("user longitude = \(userLocation.coordinate.longitude)")
        latCenter = userLocation.coordinate.latitude
        longCenter = userLocation.coordinate.longitude
        defaultLocation()
        manager.stopUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error)
    {
        print("Error \(error)")
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if indexPath.row >= 0 && indexPath.row < 4 {
            
            if indexPath.row == 0 {
                return 70.0
            }
            if indexPath.row == 1 && changeLocationVisible == false {
                return 0.0
            }
            if indexPath.row == 1 && changeLocationVisible == true {
                return 94.0
            }
            if indexPath.row == 2 && selectDistanceVisible == false{
                return 0.0
            }
            if indexPath.row == 2 && selectDistanceVisible == true{
                return 94.0
            }
            if indexPath.row == 3 {
                return 55.0
            }
        }else{
            return 44.0
        }
        return 44.0
    }
    
    @IBAction func closeChangeLocationClicked(_ sender: UIButton) {
        changeLocationVisible = false
        selectDistanceVisible = false
        setupDistanceBtn.backgroundColor = .clear
        changeLocationBtn.backgroundColor = .clear
        UIView.transition(with: tableView, duration: 0.35, options: .transitionCrossDissolve, animations: {self.tableView.reloadData()}, completion: nil)
    }
    
    @IBAction func closeSetupDistanceClicked(_ sender: UIButton) {
        changeLocationVisible = false
        selectDistanceVisible = false
        setupDistanceBtn.backgroundColor = .clear
        changeLocationBtn.backgroundColor = .clear
        UIView.transition(with: tableView, duration: 0.35, options: .transitionCrossDissolve, animations: {self.tableView.reloadData()}, completion: nil)
    }
    
    @IBAction func btnChangeLocationClicked(_ sender: UIButton) {
        setupDistanceBtn.backgroundColor = .clear
        
        setupDistanceBtn.backgroundColor = UIColor.black
        setupDistanceBtn.layer.borderWidth = 2
        setupDistanceBtn.layer.borderColor = UIColor(red:0.27, green:0.28, blue:0.35, alpha:1).cgColor
        
        changeLocationBtn.backgroundColor = UIColor.red
        ChangeLocationCell.frame.size.height = 64
        changeLocationVisible = true
        selectDistanceVisible = false
        //tableView.reloadData()
        UIView.transition(with: tableView, duration: 0.35, options: .transitionCrossDissolve, animations: {self.tableView.reloadData()}, completion: nil)
    }
    
    @IBAction func btnSetupDistanceClicked(_ sender: UIButton) {
        changeLocationBtn.backgroundColor = .clear
        setupDistanceBtn.backgroundColor = UIColor.red
        SetupDistanceCell.frame.size.height = 64
        changeLocationVisible = false
        selectDistanceVisible = true
        //tableView.reloadData()
        UIView.transition(with: tableView, duration: 0.35, options: .transitionCrossDissolve, animations: {self.tableView.reloadData()}, completion: nil)
    }

}
