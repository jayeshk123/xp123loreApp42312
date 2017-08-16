//
//  eatListTableViewController.swift
//  TestWV
//
//  Created by earth on 26/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB


class eatListTableViewController: UITableViewController {

    
    @IBOutlet var hotAndNewImage: UIImageView!
    @IBOutlet var fastCasualImage: UIImageView!
    @IBOutlet var chicagoStaplesImage: UIImageView!
    @IBOutlet var dinerImage: UIImageView!
    @IBOutlet var chicagoPizzaImage: UIImageView!
    @IBOutlet var upscaleTraditionalImage: UIImageView!
    @IBOutlet var chicImage: UIImageView!
    @IBOutlet var cafeImage: UIImageView!
    @IBOutlet var triedAndTrueImage: UIImageView!
    @IBOutlet var michelinRatedImage: UIImageView!
    
    
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
    
    struct PointOfInterest {
        var id: Int64?
        var title: String
        var isFavorite: Bool
        var longitude: Double
        var lattitude: Double
    }
    
    
    
    @IBAction func backBtnClicked(_ sender: Any) {
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "nativeDiscoverController")
        self.present(newViewController, animated: true, completion: nil)
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpDatabasePath()
        if selectAtIndex(Index: "0"){
            hotAndNewImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "1"){
            fastCasualImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "2"){
            chicagoStaplesImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "3"){
            dinerImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "4"){
            chicagoPizzaImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "5"){
            upscaleTraditionalImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "6"){
            chicImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "7"){
            cafeImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "8"){
            triedAndTrueImage.image = UIImage(named: "tick-list")
        }
        if selectAtIndex(Index: "9"){
            michelinRatedImage.image = UIImage(named: "tick-list")
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
        return 10
    }
    
    public func selectAtIndex(Index:String) -> Bool{
        
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            var elCount:Int
            elCount = 0
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM eatList where sectioIndex = ?", arguments:[Index])! // Int
                
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
                    "INSERT INTO eatList (sectionName, sectioIndex) " +
                    "VALUES (?, ?)",
                    arguments: [Name, Index])
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM eatList")
                while let row = try rows.next() {
                    let sectionName: String = row.value(named: "sectionName")
                    let sectionIndex: String = row.value(named: "sectioIndex")
                    print(sectionName)
                    print(sectionIndex)
                }
                
                let elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM eatList")! // Int
                let elSectionNames = try String.fetchAll(db, "SELECT sectionName FROM eatList")
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
                    "delete from eatList where sectioIndex = ?",
                    arguments: [Index])
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM eatList")
                while let row = try rows.next() {
                    let sectionName: String = row.value(named: "sectionName")
                    let sectionIndex: String = row.value(named: "sectioIndex")
                    print(sectionName)
                    print(sectionIndex)
                }
                
                let elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM eatList")! // Int
                let elSectionNames = try String.fetchAll(db, "SELECT sectionName FROM eatList")
                print("Count : \(elCount)")
                print(elSectionNames.count)
            }
        } catch {
            print(error.localizedDescription)
        }

    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        if indexPath.row == 0 {
            if hotAndNewImage.image == nil{
                hotAndNewImage.image = UIImage(named: "tick-list")
                hotAndNewImage.contentMode = .scaleAspectFit
                addToDB(Name: "HOT AND NEW", Index: "0")
                
            }else{
                hotAndNewImage.image = nil
                removeFromDB(Index: "0")
            }
        }
        if indexPath.row == 1 {
            if fastCasualImage.image == nil{
                fastCasualImage.image = UIImage(named: "tick-list")
                fastCasualImage.contentMode = .scaleAspectFit
                addToDB(Name: "FAST CASUAL", Index: "1")
            }else{
                fastCasualImage.image = nil
                removeFromDB(Index: "1")
            }
        }
        if indexPath.row == 2 {
            if chicagoStaplesImage.image == nil{
                chicagoStaplesImage.image = UIImage(named: "tick-list")
                chicagoStaplesImage.contentMode = .scaleAspectFit
                addToDB(Name: "CHICAGO STAPLES", Index: "2")
            }else{
                chicagoStaplesImage.image = nil
                removeFromDB(Index: "2")
            }
        }
        if indexPath.row == 3 {
            if dinerImage.image == nil{
                dinerImage.image = UIImage(named: "tick-list")
                dinerImage.contentMode = .scaleAspectFit
                addToDB(Name: "DINER", Index: "3")
            }else{
                dinerImage.image = nil
                removeFromDB(Index: "3")
            }
        }
        if indexPath.row == 4 {
            if chicagoPizzaImage.image == nil{
                chicagoPizzaImage.image = UIImage(named: "tick-list")
                chicagoPizzaImage.contentMode = .scaleAspectFit
                addToDB(Name: "CHICAGO PIZZA", Index: "4")
            }else{
                chicagoPizzaImage.image = nil
                removeFromDB(Index: "4")
            }
        }
        if indexPath.row == 5 {
            if upscaleTraditionalImage.image == nil{
                upscaleTraditionalImage.image = UIImage(named: "tick-list")
                upscaleTraditionalImage.contentMode = .scaleAspectFit
                addToDB(Name: "UPSCALE TRADITIONAL", Index: "5")
            }else{
                upscaleTraditionalImage.image = nil
                removeFromDB(Index: "5")
            }
        }
        if indexPath.row == 6 {
            if chicImage.image == nil{
                chicImage.image = UIImage(named: "tick-list")
                chicImage.contentMode = .scaleAspectFit
                addToDB(Name: "CHIC", Index: "6")
            }else{
                chicImage.image = nil
                removeFromDB(Index: "6")
            }
        }
        if indexPath.row == 7 {
            if cafeImage.image == nil{
                cafeImage.image = UIImage(named: "tick-list")
                cafeImage.contentMode = .scaleAspectFit
                addToDB(Name: "CAFE", Index: "7")
            }else{
                cafeImage.image = nil
                removeFromDB(Index: "7")
            }
        }
        if indexPath.row == 8 {
            if triedAndTrueImage.image == nil{
                triedAndTrueImage.image = UIImage(named: "tick-list")
                triedAndTrueImage.contentMode = .scaleAspectFit
                addToDB(Name: "TRIED AND TRUE", Index: "8")
            }else{
                triedAndTrueImage.image = nil
                removeFromDB(Index: "8")
            }
        }
        if indexPath.row == 9 {
            if michelinRatedImage.image == nil{
                michelinRatedImage.image = UIImage(named: "tick-list")
                michelinRatedImage.contentMode = .scaleAspectFit
                addToDB(Name: "MICHELIN RATED", Index: "9")
            }else{
                michelinRatedImage.image = nil
                removeFromDB(Index: "9")
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
