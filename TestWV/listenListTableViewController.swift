//
//  listenListTableViewController.swift
//  TestWV
//
//  Created by earth on 26/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB

class listenListTableViewController: UITableViewController {

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
        return 5
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
        if indexPath.row == 0 {
            if outdoorsImage.image == nil{
                outdoorsImage.image = UIImage(named: "tick-list")
                outdoorsImage.contentMode = .scaleAspectFit
                addToDB(Name: "OUTDOORS", Index: "0")
            }else{
                outdoorsImage.image = nil
                removeFromDB(Index: "0")
            }
        }
        if indexPath.row == 1 {
            if concertsImage.image == nil{
                concertsImage.image = UIImage(named: "tick-list")
                concertsImage.contentMode = .scaleAspectFit
                addToDB(Name: "CONCERTS", Index: "1")
            }else{
                concertsImage.image = nil
                removeFromDB(Index: "1")
            }
        }
        if indexPath.row == 2 {
            if jazzImage.image == nil{
                jazzImage.image = UIImage(named: "tick-list")
                jazzImage.contentMode = .scaleAspectFit
                addToDB(Name: "JAZZ", Index: "2")
            }else{
                jazzImage.image = nil
                removeFromDB(Index: "2")
            }
        }
        if indexPath.row == 3 {
            if smallVenueImage.image == nil{
                smallVenueImage.image = UIImage(named: "tick-list")
                smallVenueImage.contentMode = .scaleAspectFit
                addToDB(Name: "Small Venue", Index: "3")
            }else{
                smallVenueImage.image = nil
                removeFromDB(Index: "3")
            }
        }
        if indexPath.row == 4 {
            if testStoreImage.image == nil{
                testStoreImage.image = UIImage(named: "tick-list")
                testStoreImage.contentMode = .scaleAspectFit
                addToDB(Name: "Test Store", Index: "4")
            }else{
                testStoreImage.image = nil
                removeFromDB(Index: "4")
            }
        }
        
        tableView.deselectRow(at: indexPath, animated: true)
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
