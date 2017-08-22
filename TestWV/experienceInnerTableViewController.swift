//
//  experienceInnerTableViewController.swift
//  TestWV
//
//  Created by earth on 03/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB
import SearchTextField
import GRDB
import NVActivityIndicatorView

class experienceInnerTableViewController: UITableViewController {

    @IBOutlet weak var getCurrLocBtn: UIButton!
    @IBOutlet weak var changeLocBtn: UIButton!
    @IBOutlet weak var changeLocTF: UITextField!
    @IBOutlet weak var addPlacesTF: SearchTextField!
    var businesses: [Business]!
    var suggestions = [String]()
    var addresses = [String]()
    var items = [SearchTextFieldItem]()
    var dbQueue: DatabaseQueue!
    var showHiddenLocCell:Bool = false
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpDatabasePath()

        tableView.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
        
        addPlacesTF.addTarget(self, action: "TFDidChange", for: UIControlEvents.editingChanged)
        
        
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }
    
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
    
    func TFDidChange(){
        print("Edit Started")
        Business.searchWithTerm(term: addPlacesTF.text!, completion: { (businesses: [Business]?, error: Error?) -> Void in
            self.suggestions.removeAll()
            self.businesses = businesses
            self.items.removeAll()
            if let businesses = businesses {
                for business in businesses {
                    print(business.name!)
                    print(business.address!)
                    self.suggestions.append(business.name!)
                    self.addresses.append(business.address!)
                    self.items.append(SearchTextFieldItem(title: business.name!, subtitle: business.address!))
                    self.addPlacesTF.filterStrings(self.suggestions)
                    self.addPlacesTF.theme.bgColor = UIColor (red: 0.9, green: 0.9, blue: 0.9, alpha: 1)
                    
                    self.addPlacesTF.itemSelectionHandler = { filteredResults, itemPosition in
                        // Just in case you need the item position
                        //print(self.items)
                        
                        let item = filteredResults[itemPosition]
                        print("Item at position \(itemPosition): \(item.title)")
                        
                        // Do whatever you want with the picked item
                        self.addPlacesTF.text = item.title
                        Business.searchWithTerm(term: item.title, completion: { (businesses: [Business]?, error: Error?) -> Void in
                            if let businesses = businesses {
                                for business in businesses {
                                    print(business.name!)
                                    print(business.address!)
                                    print(business.locationArr?["coordinate"] as Any)
                                    self.addToDB(Name: business.name!, Location: business.address!, Coordinates: business.locationArr!)
                                    break
                                }
                            }
                        }
                        )
                    }
                    
                    self.addPlacesTF.userStoppedTypingHandler = {
                        if let criteria = self.addPlacesTF.text {
                            if criteria.characters.count > 1 {
                                
                                // Show the loading indicator
                                self.addPlacesTF.showLoadingIndicator()
                                
                               
                            }
                        }
                    }
                    // 200 Queen St, Saint John, New Brunswick E2L 2X1, Canada
                    self.addPlacesTF.maxNumberOfResults = 5
                }
            }
            
        }
        )
        
        print(suggestions)
    }
    
    public func addToDB(Name:String, Location:String, Coordinates:NSDictionary){
        do {
            try dbQueue.inDatabase { db in
                try db.execute(
                    "INSERT INTO experience (name, location, distance, status, lattitude, longitude, description, image, selected, uniqueId) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    arguments: [Name, Location, "1 mi away", "OPEN", String(describing: Coordinates["latitude"]),String(describing: Coordinates["longitude"]),"Test Desc","default.png","0",0])
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM drinkList")
                
                while let row = try rows.next() {
                    let sectionName: String = row.value(named: "sectionName")
                    let sectionIndex: String = row.value(named: "sectioIndex")
                    print(sectionName)
                    print(sectionIndex)
                }
                
                let elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM drinkList")! // Int
                let elSectionNames = try String.fetchAll(db, "SELECT sectionName FROM drinkList")
                print("Count : \(elCount)")
                print(elSectionNames[0])
                let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
                NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
                let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                let newViewController = storyBoard.instantiateViewController(withIdentifier: "experienceTableTableViewController")
                self.present(newViewController, animated: true, completion: nil)
                print("TEST")
            }
        } catch {
            print(error.localizedDescription)
        }
    }

    
    @IBAction func changeLocationClicked(_ sender: UIButton) {
        print("Change Location Clicked")
        if showHiddenLocCell == false{
            showHiddenLocCell = true
        }else{
            showHiddenLocCell = false
        }
        tableView.reloadData()
    }
    
    @IBAction func getCurrLocClicked(_ sender: UIButton) {
        print("Get Current Location Clicked")
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
        return 4
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if indexPath.row >= 0 && indexPath.row <= 3 {
            if indexPath.row == 0 {
                return 79.0
            }
            if indexPath.row == 1 && showHiddenLocCell == true {
                return 126.0
            }
            if indexPath.row == 1 && showHiddenLocCell == false {
                return 0.0
            }
            if indexPath.row == 2 {
                return 126.0
            }
            if indexPath.row == 3 {
                return 300.0
            }
        }else{
            return 0.0
        }
        return 200
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
