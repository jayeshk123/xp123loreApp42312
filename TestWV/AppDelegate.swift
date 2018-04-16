//
//  AppDelegate.swift
//  TestWV
//
//  Created by earth on 13/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB
import GooglePlaces
import GoogleMaps
import Alamofire
import FBSDKLoginKit
import RZTransitions

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    let tabBarController = UITabBarController()
    var URL = "http://34.231.31.72/xplore/index.php"
    /* 
        let storyBoard : UIStoryboard = UIStoryboard(name: "Main", bundle:nil)
 
        let nextViewController = storyBoard.instantiateViewControllerWithIdentifier("nextView") as NextViewController
        self.presentViewController(nextViewController, animated:true, completion:nil)*/
    
    /*
        let storyboard = UIStoryboard(name: "Main", bundle: nil);
        let moreView = storyboard.instantiateViewControllerWithIdentifier("moreView") as! MoreView;
        moreView.modalPresentationStyle = UIModalPresentationStyle.FullScreen;
        self.presentViewController(moreView, animated: true, completion: nil)
     */
 
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        
        do{
            let filemgr = FileManager.default
            
            let dirPaths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)
            
            let databasePath1 = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            
            //if not there, copy from bundle
            if !filemgr.fileExists(atPath: databasePath1) {
                let bundleDatabasePath = Bundle.main.path(forResource: "sqliteDB", ofType: "sqlite")
                try filemgr.copyItem(atPath: bundleDatabasePath!, toPath: databasePath1)
                
            }
            setUpDatabasePath()

        }catch{
            print(error.localizedDescription)
        }
        
        
        
        do {
            
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                try db.create(table: "eatList") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("sectionName", .text).notNull()
                    t.column("sectioIndex", .text).notNull()
                    //t.column("sectioIndex", .boolean).notNull().defaults(to: false)
                }
                
                try db.create(table: "doList") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("sectionName", .text).notNull()
                    t.column("sectioIndex", .text).notNull()
                    //t.column("sectioIndex", .boolean).notNull().defaults(to: false)
                }
                
                try db.create(table: "watchList") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("sectionName", .text).notNull()
                    t.column("sectioIndex", .text).notNull()
                    //t.column("sectioIndex", .boolean).notNull().defaults(to: false)
                }
                
                try db.create(table: "listenList") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("sectionName", .text).notNull()
                    t.column("sectioIndex", .text).notNull()
                    //t.column("sectioIndex", .boolean).notNull().defaults(to: false)
                }
                
                try db.create(table: "drinkList") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("sectionName", .text).notNull()
                    t.column("sectioIndex", .text).notNull()
                    //t.column("sectioIndex", .boolean).notNull().defaults(to: false)
                }
                
                try db.create(table: "selectList") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("sectionName", .text).notNull()
                    t.column("sectionURL", .text).notNull()
                    //t.column("sectioIndex", .boolean).notNull().defaults(to: false)
                }
                
                try db.create(table: "selectedDistance") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("distanceInMiles", .text).notNull()
                }
                
                try db.create(table: "appUser") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("fbId", .text).notNull()
                }
                /*try db.execute(
                    "INSERT INTO selectedDistance (distanceInMiles) " +
                    "VALUES ('2.5')")*/
                
                try db.create(table: "selectedPlaces") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("uniqueID", .integer).notNull()
                }
                
                try db.create(table: "locations") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("name", .text).notNull()
                    t.column("location", .text).notNull()
                    t.column("distance", .text).notNull()
                    t.column("status", .text).notNull()
                    t.column("lattitude", .text).notNull()
                    t.column("longitude", .text).notNull()
                    t.column("description", .text).notNull()
                    t.column("image", .text).notNull()
                    //t.column("sectioIndex", .boolean).notNull().defaults(to: false)
                }
                
                try db.create(table: "experience") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("uniqueId", .text).notNull()
                    t.column("name", .text).notNull()
                    t.column("location", .text).notNull()
                    t.column("distance", .text).notNull()
                    t.column("status", .text).notNull()
                    t.column("lattitude", .text).notNull()
                    t.column("longitude", .text).notNull()
                    t.column("description", .text).notNull()
                    t.column("image", .text).notNull()
                    t.column("selected", .text).notNull()
                    t.column("visited", .text)
                    t.column("position", .text)
                    //t.column("sectioIndex", .boolean).notNull().defaults(to: false)
                }
                
                try db.create(table: "placeProfile") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("uniqueId", .integer).notNull()
                    t.column("name", .text).notNull()
                    t.column("address", .text).notNull()
                    t.column("distance", .text).notNull()
                    t.column("website", .text).notNull()
                    t.column("lattitude", .text).notNull()
                    t.column("longitude", .text).notNull()
                    t.column("description", .text).notNull()
                    t.column("image", .text).notNull()
                    t.column("phone", .text).notNull()
                    t.column("foursquareRating", .text).notNull()
                    t.column("yelpRating", .text).notNull()
                    t.column("quality", .text).notNull()
                    t.column("totalReviews", .text).notNull()
                    t.column("avgRating", .text).notNull()
                }
                
                try db.create(table: "showSelected") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("isSelected", .integer).notNull()
                }

                try db.execute("delete from showSelected")
                
                try db.execute(
                    "INSERT INTO showSelected (id,isSelected) " +
                    "VALUES (1,'0')")
                
                try db.create(table: "backClicked") { t in
                    t.column("id", .integer).primaryKey()
                    t.column("redirectTo", .text).notNull()
                }
                
                try db.execute(
                    "INSERT INTO showSelected (id,isSelected) " +
                    "VALUES (1,'default')")
                
               /* try db.execute(
                    "INSERT INTO experience (name, location, distance, status, lattitude, longitude, description, image, selected, uniqueId) " +
                    "VALUES ('AGORA Figures', '104-116 E Roosevelt Rd, Chicago, IL 60605, USA', '1 mi away', 'Open', '41.86767352','-87.6236742', 'Test Desc', 'default.jpg', '0',0)")
                try db.execute(
                    "INSERT INTO experience (name, location, distance, status, lattitude, longitude, description, image, selected, uniqueId) " +
                    "VALUES ('Stage and chess at dearborn park', '32-48 W 9th St, Chicago, IL 60605, USA', '1 mi away', 'Open', '41.8707446','-87.620911', 'Test Desc', 'default.jpg', '0', 0)")
                try db.execute(
                    "INSERT INTO experience (name, location, distance, status, lattitude, longitude, description, image, selected, uniqueId) " +
                    "VALUES ('Blue Cross and Ble Shield of Illinois Great Lawn', '5 S Columbus Dr, Chicago, IL 60601, USA', '1 mi away', 'Open', '41.88150033','-87.620911', 'Test Desc', 'default.jpg', '0', 0)")
                try db.execute(
                    "INSERT INTO experience (name, location, distance, status, lattitude, longitude, description, image, selected, uniqueId) " +
                    "VALUES ('Private Seating in back of Adler Planetarium', '1300 S Lake Shore Dr, Chicago, Illinois 60605, United States', '1 mi away', 'Open', '41.8657909','-87.606281', 'Test Desc', 'default.jpg', '0', 0)")
                
                try db.execute("INSERT INTO experience (name, location, distance, status, lattitude, longitude, description, image, selected, uniqueId) " + "VALUES ('Americas Courtyard','Near the Adler Planetarium','1 mi away', 'Open', '41.86334671','-87.6079373', 'Test Desc', 'default.jpg', '0', 0)")*/
            }
        } catch {
            print(error.localizedDescription)
        }
        
        RZTransitionsManager.shared().defaultPushPopAnimationController = RZCardSlideAnimationController()
        //RZTransitionsManager.shared().defaultPresentDismissAnimationController = RZZoomPushAnimationController()
        
        UIApplication.shared.statusBarStyle = .lightContent
                return FBSDKApplicationDelegate.sharedInstance().application(application, didFinishLaunchingWithOptions: launchOptions)
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

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
        FBSDKAppEvents.activateApp()
    }

    func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
        return FBSDKApplicationDelegate.sharedInstance().application(application, open: url, sourceApplication: sourceApplication, annotation: annotation)
    }
    
    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }


}

